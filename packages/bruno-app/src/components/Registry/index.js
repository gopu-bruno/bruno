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
 *   - Install = git CLONE the collection's source repo into the workspace,
 *     reusing the existing CloneGitRepository flow (clone → scan → open).
 *
 * The shared UI is host-agnostic (pure React + inline styles + scoped CSS vars).
 * We wrap it in `.oc-registry` so its tokens never leak into the app's theme.
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import jsyaml from 'js-yaml';
import { FindAndSharePage, CollectionDetailPage, PublishCollectionModal, REGISTRY_INDEX_RAW_URL } from '@usebruno/registry-ui';
import '@usebruno/registry-ui/tokens.css';
import { hideRegistryPage } from 'providers/ReduxStore/slices/app';
import { buildOpenCollectionYaml } from 'utils/exporters/opencollection';
import CloneGitRepository from 'components/Sidebar/CloneGitRespository';

const Registry = () => {
  const dispatch = useDispatch();
  // Collections open in the workspace — the publish flow picks one to bundle.
  const collections = useSelector((state) => state.collections.collections);
  // Live data from the git-backed index; null until it resolves (the page falls
  // back to its bundled snapshot meanwhile).
  const [data, setData] = useState(null);
  // Local browse <-> detail routing inside the takeover.
  const [view, setView] = useState({ name: 'browse' });
  // When set, the clone-into-workspace modal opens, pre-filled with this repo.
  const [installRepoUrl, setInstallRepoUrl] = useState(null);
  // The collection's subdir within that repo, so the clone scopes to just it.
  const [installSubdir, setInstallSubdir] = useState(null);
  // The git ref to clone — the latest published version tag when one exists,
  // so installing gets that version (not whatever HEAD happens to be).
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

  const openCollection = (c) => setView({ name: 'detail', collection: c });
  const goBrowse = () => setView({ name: 'browse' });

  const handleSearch = (q, filters) => {
    // In-app search lands next; for now surface intent without breaking the flow.
    console.log('[registry] search', { q, filters });
  };

  // Install = clone the collection's source git repo into the workspace. We open
  // the existing CloneGitRepository flow pre-filled with the repo URL, reusing
  // its location picker, progress, scan and open-into-workspace logic.
  // Latest published version tag for a collection (from the baked/live release
  // stats), e.g. "stripe-stripe-api@1.0.0". Null when the collection has no
  // releases yet — then we fall back to source.ref (the default branch).
  const latestReleaseTag = (c) => (c && c.releases && c.releases[0] && c.releases[0].tag) || null;
  const installRefFor = (c) => latestReleaseTag(c) || (c && c.source && c.source.ref) || null;

  const handleInstall = (c) => {
    const repo = c?.source?.repo;
    if (!repo) {
      toast.error(`No source repository listed for ${c?.ns}/${c?.name}`);
      return;
    }
    setInstallSubdir(c?.source?.subdir || null);
    setInstallRef(installRefFor(c));
    setInstallRepoUrl(repo);
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

  // Real publish: build a (stub) opencollection.yml from the metadata, then ask
  // the MAIN process to create the GitHub release + upload the asset (the
  // renderer can't upload to uploads.github.com — no CORS). Real collection
  // bundling via exportCollection comes once we wire collection selection.
  const handlePublishRelease = async ({ meta, entry, tag, name, body, collection }) => {
    const { ipcRenderer } = window;
    if (!ipcRenderer) throw new Error('Publishing is only available in the desktop app.');
    // Bundle the picked collection to a single opencollection.yml. Fall back to
    // a metadata stub only if no collection was selected.
    const yaml = collection
      ? buildOpenCollectionYaml(collection, meta.version)
      : jsyaml.dump({
          opencollection: '1.0.0',
          info: {
            name: entry.title,
            version: meta.version,
            description: entry.tagline,
            category: entry.category
          },
          extensions: { bruno: { publishedVia: 'registry', ns: entry.ns, name: entry.name } }
        });
    const res = await ipcRenderer.invoke('renderer:publish-collection', {
      repo: entry.source.repo,
      tag,
      name,
      body,
      yaml,
      pat: meta.pat
    });
    return res; // { releaseUrl, assetUrl, tag }
  };

  // First-time listing: open a PR to collection-registry adding the entry.
  const handleListCollection = async ({ entry, meta }) => {
    const { ipcRenderer } = window;
    if (!ipcRenderer) throw new Error('Listing is only available in the desktop app.');
    return ipcRenderer.invoke('renderer:open-registry-pr', { entry, pat: meta.pat }); // { prUrl }
  };

  return (
    <div className="oc-registry" style={{ height: '100%', width: '100%', minHeight: 0 }}>
      {view.name === 'detail' ? (
        <CollectionDetailPage
          collection={view.collection}
          onBack={goBrowse}
          onInstall={() => handleInstall(view.collection)}
          installLabel="Clone & add"
          installCommand={(() => {
            const repo = view.collection?.source?.repo;
            if (!repo) return undefined;
            const tag = latestReleaseTag(view.collection);
            return tag ? `git clone --branch ${tag} ${repo}` : `git clone ${repo}`;
          })()}
        />
      ) : (
        <FindAndSharePage onOpenCollection={openCollection} onSearch={handleSearch} onPublish={() => setShowPublish(true)} registryData={data} />
      )}

      {showPublish && (
        <PublishCollectionModal
          onClose={() => setShowPublish(false)}
          onPublishRelease={handlePublishRelease}
          onListCollection={handleListCollection}
          onResolveCollectionMeta={resolveCollectionMeta}
          localCollections={collections}
          registryEntries={data?.all || []}
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
