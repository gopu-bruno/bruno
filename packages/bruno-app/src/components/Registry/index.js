/**
 * Registry — the in-app host for the OpenCollection registry surface.
 *
 * Rendered as a full-screen takeover (driven by the `showRegistryPage` flag),
 * mirroring ManageWorkspace / ApiSpecPanel. It mounts the SAME shared components
 * the website uses (`@usebruno/registry-ui`) and wires app behavior into their
 * callbacks — so the find/share page and detail page stay a single source of
 * truth across the website and the desktop app.
 *
 * Data comes through a RegistrySource (Phase C): an ApiSource pointed at the
 * registry server's projection (real trending from measured installs, FTS
 * search + facet counts), with a StaticIndexSource fallback on the raw index so
 * browse/install survive a server outage (the advisory contract). All HTTP runs
 * in the Electron MAIN process (renderer CSP blocks external fetch).
 *
 * App-specific behavior (vs. the website host):
 *   - Install resolves the collection's LATEST version and its source:
 *       • git → CLONE the repo at the version's ref/subdir into the workspace.
 *       • url → download the hosted opencollection.yml artifact (hash-verified).
 *   - After a SUCCESSFUL install, report it to the server (advisory, coordinate-
 *     only, fire-and-forget) and refresh discover so trending reflects it live.
 *   - Publish = open a PR to the registry (renderer:open-registry-pr).
 */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import jsyaml from 'js-yaml';
import {
  FindAndSharePage,
  CollectionDetailPage,
  PublishCollectionModal,
  CollectionCard,
  REGISTRY_INDEX_RAW_URL,
  createRegistrySource,
  latestVersionEntry,
  gitSourceOf
} from '@usebruno/registry-ui';
import '@usebruno/registry-ui/tokens.css';
import { hideRegistryPage } from 'providers/ReduxStore/slices/app';
import { importCollection } from 'providers/ReduxStore/slices/collections/actions';
import CloneGitRepository from 'components/Sidebar/CloneGitRespository';
import ImportCollectionLocation from 'components/Sidebar/ImportCollectionLocation';

// The registry server (projection + advisory counts). Override at build time
// with REGISTRY_API_URL; the raw index is the offline/outage fallback. Guarded
// `process` access — the renderer bundler may not define it.
const REGISTRY_API_BASE
  = (typeof process !== 'undefined' && process.env && process.env.REGISTRY_API_URL) || 'http://localhost:4500';

const Registry = () => {
  const dispatch = useDispatch();
  // Collections open in the workspace — the publish flow picks one.
  const collections = useSelector((state) => state.collections.collections);
  // Live discover data from the source; null until it resolves (the page falls
  // back to its bundled snapshot meanwhile).
  const [data, setData] = useState(null);
  // Local browse <-> search <-> detail routing inside the takeover.
  const [view, setView] = useState({ name: 'browse' });
  // Install count for the open collection (from the server), or null.
  const [installCount, setInstallCount] = useState(null);
  // Search results for the search view.
  const [searchState, setSearchState] = useState(null);
  // Which backing served the last call: 'api' (live server), 'static' (fell back
  // to the git-backed index), or 'error'. Drives the status badge so the advisory
  // fallback is visible, not silent.
  const [mode, setMode] = useState(null);
  // When set, the clone-into-workspace modal opens, pre-filled with this repo.
  const [installRepoUrl, setInstallRepoUrl] = useState(null);
  const [installSubdir, setInstallSubdir] = useState(null);
  const [installRef, setInstallRef] = useState(null);
  // The collection currently being installed — so we can report it on success.
  const [installing, setInstalling] = useState(null);
  // For a `url`-source install: the parsed opencollection to drop into the workspace.
  const [urlImport, setUrlImport] = useState(null);
  // Publish modal + the catalog entries it needs to detect "already listed".
  // (discover intentionally doesn't ship the whole catalog, so load it lazily.)
  const [showPublish, setShowPublish] = useState(false);
  const [publishEntries, setPublishEntries] = useState([]);

  // One RegistrySource for the whole takeover. IO routes through the Electron
  // main process (no renderer CSP/CORS issues, no API rate limits).
  const source = useMemo(() => {
    const { ipcRenderer } = window;
    const io = ipcRenderer
      ? {
          getJson: (url) => ipcRenderer.invoke('renderer:registry-fetch', { url }),
          postJson: () => Promise.resolve(null) // reports go through renderer:report-install
        }
      : undefined;
    return createRegistrySource(
      { kind: 'api', baseUrl: REGISTRY_API_BASE, indexUrl: REGISTRY_INDEX_RAW_URL },
      io
    );
  }, []);

  const loadDiscover = useCallback(() => {
    source
      .getDiscover()
      .then((d) => {
        setData(d);
        setMode(source.lastMode);
      })
      .catch((err) => {
        setMode(source.lastMode || 'error');
        console.error('[registry] discover load failed', err);
      });
  }, [source]);

  useEffect(() => {
    loadDiscover();
  }, [loadDiscover]);

  // Fetch the install count whenever a detail page opens (hidden if unavailable).
  useEffect(() => {
    if (view.name !== 'detail') return undefined;
    let alive = true;
    setInstallCount(null);
    source
      .getInstallCount(view.collection.ns, view.collection.name)
      .then((n) => alive && setInstallCount(n))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [view, source]);

  const openCollection = (c) => setView({ name: 'detail', collection: c });
  const goBrowse = () => setView({ name: 'browse' });

  // Search runs server-side (FTS + facet counts), with a client fallback when
  // the server is down. Lands on a results view inside the takeover.
  const handleSearch = (q, filters = {}) => {
    setView({ name: 'search', query: q, filters });
    setSearchState({ loading: true, query: q, filters });
    source
      .search(q, filters)
      .then((res) => {
        setSearchState({ ...res, query: q, filters });
        setMode(source.lastMode);
      })
      .catch((err) => {
        setMode(source.lastMode || 'error');
        console.error('[registry] search failed', err);
        setSearchState({ results: [], total: 0, facets: {}, query: q, filters });
      });
  };

  // Report a successful install — advisory, fire-and-forget. Then refresh
  // discover so trending reflects the new count without leaving the page.
  const reportInstall = (c, sourceType) => {
    const { ipcRenderer } = window;
    if (!ipcRenderer || !c) return;
    ipcRenderer
      .invoke('renderer:report-install', { baseUrl: REGISTRY_API_BASE, ns: c.ns, name: c.name, source: sourceType })
      .then(() => loadDiscover())
      .catch(() => {});
  };

  // Install = resolve the latest version's source and bring it into the workspace.
  const handleInstall = (c) => {
    const v = latestVersionEntry(c);
    if (!v) {
      toast.error(`No versions listed for ${c?.ns}/${c?.name}`);
      return;
    }
    if (v.type === 'git') {
      const g = gitSourceOf(v);
      if (!g) {
        toast.error(`Version ${v.version} of ${c?.ns}/${c?.name} has no git repo.`);
        return;
      }
      setInstalling({ collection: c, source: 'git' });
      setInstallSubdir(g.subdir || null);
      setInstallRef(g.ref || null);
      setInstallRepoUrl(g.repo);
      return;
    }
    installFromUrl(c, v);
  };

  // url source — download the opencollection artifact in MAIN (verifying its
  // hash when present), parse it, and hand it to the shared import-location flow.
  const installFromUrl = async (c, v) => {
    const url = v.source?.url;
    if (!url) {
      toast.error(`Version ${v.version} of ${c?.ns}/${c?.name} has no url.`);
      return;
    }
    const { ipcRenderer } = window;
    if (!ipcRenderer) {
      toast.error('Installing from a URL is only available in the desktop app.');
      return;
    }
    const id = toast.loading(`Downloading ${c.ns}/${c.name} v${v.version}…`);
    try {
      const { text, verified } = await ipcRenderer.invoke('renderer:fetch-collection-artifact', { url, hash: v.hash });
      const parsed = jsyaml.load(text);
      if (!parsed || typeof parsed !== 'object') throw new Error('The artifact is not a valid opencollection.yml.');
      toast.success(verified ? 'Downloaded — hash verified.' : 'Downloaded.', { id });
      setInstalling({ collection: c, source: 'url' });
      setUrlImport({ rawData: parsed });
    } catch (e) {
      toast.error((e && e.message) || 'Failed to download the collection artifact.', { id });
    }
  };

  // The import-location flow resolved a destination — write the collection in,
  // then report the install (url source) before leaving the takeover.
  const handleUrlImportSubmit = (convertedCollection, collectionLocation, options = {}) => {
    dispatch(importCollection(convertedCollection, collectionLocation, options))
      .then(() => {
        if (installing && installing.source === 'url') reportInstall(installing.collection, 'url');
        setUrlImport(null);
        setInstalling(null);
        dispatch(hideRegistryPage());
      })
      .catch((err) => toast.error((err && err.message) || 'Import failed.'));
  };

  // Latest version label + a truthful install command for the detail page.
  const installCommandFor = (c) => {
    const v = latestVersionEntry(c);
    if (!v) return undefined;
    if (v.type === 'git') {
      const g = gitSourceOf(v);
      if (!g) return undefined;
      return g.ref ? `git clone --branch ${g.ref} ${g.repo}` : `git clone ${g.repo}`;
    }
    return `curl -L ${v.source?.url || '<artifact-url>'} -o opencollection.yml`;
  };

  // When a collection is picked in the publish modal, resolve its git remote in
  // MAIN so we can prefill the source repo + subdir (no manual paste needed).
  const resolveCollectionMeta = async (c) => {
    const { ipcRenderer } = window;
    if (!ipcRenderer || !c?.pathname) return null;
    try {
      const info = await ipcRenderer.invoke('renderer:get-collection-git-info', { pathname: c.pathname });
      if (!info) return null;
      return { repo: info.remote, subdir: info.subdir, owner: info.owner };
    } catch (e) {
      return null;
    }
  };

  // Open publish — load the full catalog (so the modal can detect whether the
  // collection is already listed) before showing it.
  const openPublish = () => {
    setShowPublish(true);
    source
      .search('', {})
      .then((res) => setPublishEntries(res.results || []))
      .catch(() => setPublishEntries(data?.all || []));
  };

  // Publish = open a PR to the registry repo.
  const handleOpenRegistryPr = async ({ entry, version, alreadyListed, meta }) => {
    const { ipcRenderer } = window;
    if (!ipcRenderer) throw new Error('Publishing is only available in the desktop app.');
    return ipcRenderer.invoke('renderer:open-registry-pr', { entry, version, alreadyListed, pat: meta.pat });
  };

  return (
    <div className="oc-registry" style={{ position: 'relative', height: '100%', width: '100%', minHeight: 0 }}>
      <RegistryStatusBadge mode={mode} />
      {view.name === 'detail' ? (
        <CollectionDetailPage
          collection={view.collection}
          onBack={goBrowse}
          onInstall={() => handleInstall(view.collection)}
          installLabel="Add to Bruno"
          installCommand={installCommandFor(view.collection)}
          installCount={installCount}
        />
      ) : view.name === 'search' ? (
        <SearchResults
          state={searchState}
          onBack={goBrowse}
          onOpen={openCollection}
          onRefine={(filters) => handleSearch(view.query, { ...view.filters, ...filters })}
        />
      ) : (
        <FindAndSharePage onOpenCollection={openCollection} onSearch={handleSearch} onPublish={openPublish} registryData={data} />
      )}

      {showPublish && (
        <PublishCollectionModal
          onClose={() => setShowPublish(false)}
          onOpenRegistryPr={handleOpenRegistryPr}
          onResolveCollectionMeta={resolveCollectionMeta}
          localCollections={collections}
          registryEntries={publishEntries}
        />
      )}

      {installRepoUrl && (
        <CloneGitRepository
          collectionRepositoryUrl={installRepoUrl}
          collectionSubdir={installSubdir}
          collectionRef={installRef}
          onClose={() => {
            setInstallRepoUrl(null);
            setInstallSubdir(null);
            setInstallRef(null);
            setInstalling(null);
          }}
          onFinish={() => {
            // Collection cloned into the workspace — report the install, then
            // leave the registry takeover.
            if (installing && installing.source === 'git') reportInstall(installing.collection, 'git');
            setInstallRepoUrl(null);
            setInstallSubdir(null);
            setInstallRef(null);
            setInstalling(null);
            dispatch(hideRegistryPage());
          }}
        />
      )}

      {urlImport && (
        <ImportCollectionLocation
          rawData={urlImport.rawData}
          format="opencollection"
          onClose={() => {
            setUrlImport(null);
            setInstalling(null);
          }}
          handleSubmit={handleUrlImportSubmit}
        />
      )}
    </div>
  );
};

// Status badge — makes the advisory fallback visible. 'api' = live server (real
// counts/trending/FTS); 'static' = the server is unreachable and we're serving
// the git-backed index.json directly (browse/install still work); 'error' = both
// failed. Hidden until the first call resolves.
const RegistryStatusBadge = ({ mode }) => {
  const [hover, setHover] = useState(false);
  if (!mode) return null;
  const map = {
    api: { dot: '#1a7f37', short: 'Online', long: 'Online · registry server' },
    static: { dot: '#bf8700', short: 'Offline', long: 'Offline · git-backed index' },
    error: { dot: '#cf222e', short: 'Offline', long: 'Offline · registry unreachable' }
  };
  const s = map[mode] || map.error;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute', top: 10, right: 12, zIndex: 20,
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '1px 7px 1px 6px', borderRadius: 999,
        background: hover ? '#fff' : 'transparent',
        border: '1px solid var(--border-1)',
        fontSize: 9.5, lineHeight: 1.5, letterSpacing: '0.01em',
        color: 'var(--fg-subtext-2)', opacity: hover ? 1 : 0.65,
        fontFamily: 'var(--font-sans)', userSelect: 'none',
        cursor: 'default', transition: 'opacity 120ms ease, background 120ms ease'
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {hover ? s.long : s.short}
    </div>
  );
};

// In-app search results — renders the source's { results, total, facets }.
// Server-backed (FTS + facet counts) or client-fallback; same shape either way.
const SearchResults = ({ state, onBack, onOpen, onRefine }) => {
  const s = state || { loading: true };
  const results = s.results || [];
  const facets = (s.facets && s.facets.category) || [];
  return (
    <div style={{ overflow: 'auto', height: '100%', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', padding: '20px 56px 8px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, border: 0, background: 'transparent',
            cursor: 'pointer', color: 'var(--fg-subtext-1)', fontSize: 12.5, fontFamily: 'inherit', padding: 0
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>←</span> Browse
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 12 }}>
          {s.loading ? 'Searching…' : `${s.total || 0} result${(s.total || 0) === 1 ? '' : 's'}`}
          {s.query ? <span style={{ color: 'var(--fg-subtext-1)', fontWeight: 400 }}> for “{s.query}”</span> : null}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 32, maxWidth: 1160, margin: '0 auto', padding: '16px 56px 48px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, alignContent: 'start' }}>
          {results.map((c) => (
            <CollectionCard key={c.ns + '/' + c.name} c={c} onOpen={onOpen} />
          ))}
          {!s.loading && !results.length && (
            <div style={{ color: 'var(--fg-subtext-1)', fontSize: 13 }}>No collections matched.</div>
          )}
        </div>
        {facets.length > 0 && (
          <aside>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Filter by category</h3>
            <div style={{ display: 'grid', gap: 6 }}>
              {facets.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onRefine({ category: f.id })}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                    padding: '9px 12px', border: '1px solid var(--border-1)', borderRadius: 6,
                    background: s.filters && s.filters.category === f.id ? 'var(--bg-surface-0)' : '#fff',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, textAlign: 'left'
                  }}
                >
                  <span>{f.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtext-1)' }}>{f.count}</span>
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Registry;
