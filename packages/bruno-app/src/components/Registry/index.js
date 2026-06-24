/**
 * Registry — the in-app host for the OpenCollection registry surface.
 *
 * Rendered as a full-screen takeover (driven by the `showRegistryPage` flag),
 * mirroring ManageWorkspace / ApiSpecPanel. It mounts the SAME shared components
 * the website uses (`@usebruno/registry-ui`) and wires app behavior into their
 * callbacks — so the find/share page and detail page stay a single source of
 * truth across the website and the desktop app.
 *
 * App-specific behavior (vs. the website host):
 *   - Index fetch runs in the Electron MAIN process against the raw CDN URL
 *     (renderer CSP blocks external fetch; raw has no rate limit). See the
 *     `renderer:fetch-registry-index` IPC.
 *   - Install resolves the collection's LATEST version and its source:
 *       • git → CLONE the repo at the version's ref/subdir into the workspace
 *         (reusing the existing CloneGitRepository flow).
 *       • url → download the hosted opencollection.yml artifact (in progress).
 *   - Install counts come from a separate public API (fetchInstallCount); the
 *     stat is hidden until that API is configured/live.
 *   - Publish = open a PR to the registry that lists the collection or appends a
 *     version (renderer:open-registry-pr). There is no GitHub Release step.
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  FindAndSharePage,
  CollectionDetailPage,
  PublishCollectionModal,
  REGISTRY_INDEX_RAW_URL,
  latestVersionEntry,
  gitSourceOf,
  fetchInstallCount,
  deriveHome
} from '@usebruno/registry-ui';
import '@usebruno/registry-ui/tokens.css';
import { hideRegistryPage } from 'providers/ReduxStore/slices/app';
import CloneGitRepository from 'components/Sidebar/CloneGitRespository';

const Registry = () => {
  const dispatch = useDispatch();
  // Collections open in the workspace — the publish flow picks one.
  const collections = useSelector((state) => state.collections.collections);
  // Live data from the git-backed index; null until it resolves (the page falls
  // back to its bundled snapshot meanwhile).
  const [data, setData] = useState(null);
  // Local browse <-> detail routing inside the takeover.
  const [view, setView] = useState({ name: 'browse' });
  // Install count for the open collection (from the public API), or null.
  const [installCount, setInstallCount] = useState(null);
  // When set, the clone-into-workspace modal opens, pre-filled with this repo.
  const [installRepoUrl, setInstallRepoUrl] = useState(null);
  // The collection's subdir within that repo, so the clone scopes to just it.
  const [installSubdir, setInstallSubdir] = useState(null);
  // The git ref to clone — the latest version's ref, so installing gets that
  // version (not whatever HEAD happens to be).
  const [installRef, setInstallRef] = useState(null);
  // Publish modal.
  const [showPublish, setShowPublish] = useState(false);

  useEffect(() => {
    let alive = true;
    const { ipcRenderer } = window;
    if (!ipcRenderer) return undefined;
    // Fetch from the main process (raw CDN, no rate limit, no CSP/CORS issues).
    ipcRenderer
      .invoke('renderer:fetch-registry-index', { url: REGISTRY_INDEX_RAW_URL })
      .then((d) => alive && setData(d))
      .catch((err) => console.error('[registry] index load failed', err));
    return () => {
      alive = false;
    };
  }, []);

  // Fetch the install count whenever a detail page opens (hidden if unavailable).
  useEffect(() => {
    if (view.name !== 'detail') return undefined;
    let alive = true;
    setInstallCount(null);
    fetchInstallCount(view.collection.ns, view.collection.name)
      .then((n) => alive && setInstallCount(n))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [view]);

  const openCollection = (c) => setView({ name: 'detail', collection: c });
  const goBrowse = () => setView({ name: 'browse' });

  const handleSearch = (q, filters) => {
    // In-app search lands next; for now surface intent without breaking the flow.
    console.log('[registry] search', { q, filters });
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
      setInstallSubdir(g.subdir || null);
      setInstallRef(g.ref || null);
      setInstallRepoUrl(g.repo);
      return;
    }
    // url source — download + import lands next; the artifact is resolved here.
    toast(`v${v.version} is a URL source — installing from a hosted artifact lands next.\n${v.source?.url || ''}`);
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

  // Publish = open a PR to the registry repo. Lists a new collection, or
  // appends a version to an already-listed one. The maintainer reviews/merges.
  const handleOpenRegistryPr = async ({ entry, version, alreadyListed, meta }) => {
    const { ipcRenderer } = window;
    if (!ipcRenderer) throw new Error('Publishing is only available in the desktop app.');
    return ipcRenderer.invoke('renderer:open-registry-pr', { entry, version, alreadyListed, pat: meta.pat });
  };

  return (
    <div className="oc-registry" style={{ height: '100%', width: '100%', minHeight: 0 }}>
      {view.name === 'detail' ? (
        <CollectionDetailPage
          collection={view.collection}
          onBack={goBrowse}
          onInstall={() => handleInstall(view.collection)}
          installLabel="Add to Bruno"
          installCommand={installCommandFor(view.collection)}
          installCount={installCount}
        />
      ) : (
        <FindAndSharePage onOpenCollection={openCollection} onSearch={handleSearch} onPublish={() => setShowPublish(true)} registryData={deriveHome(data)} />
      )}

      {showPublish && (
        <PublishCollectionModal
          onClose={() => setShowPublish(false)}
          onOpenRegistryPr={handleOpenRegistryPr}
          onResolveCollectionMeta={resolveCollectionMeta}
          localCollections={collections}
          registryEntries={data?.collections || data?.all || []}
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
          }}
          onFinish={() => {
            // Collection opened into the workspace — leave the registry takeover.
            setInstallRepoUrl(null);
            setInstallSubdir(null);
            setInstallRef(null);
            dispatch(hideRegistryPage());
          }}
        />
      )}
    </div>
  );
};

export default Registry;
