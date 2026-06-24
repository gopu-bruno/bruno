// Website host for the registry UI.
//
// This file is the web-specific glue: it imports the shared design tokens,
// fetches the live git-backed registry index, lays out the app shell (sidebar +
// content), and wires website behavior into the shared components' callbacks.
// bruno-app has its own equivalent host (open a detail tab, install into the
// workspace) reusing the same registry-ui components unchanged.
import React, { useEffect, useState } from 'react';
import '@usebruno/registry-ui/tokens.css';
import {
  Sidebar,
  FindAndSharePage,
  CollectionDetailPage,
  PublishCollectionModal,
  fetchRegistryIndex,
  latestVersionEntry,
  gitSourceOf,
  deriveHome,
} from '@usebruno/registry-ui';

export default function App() {
  // Live data from the git-backed index; null until it resolves (page falls
  // back to its bundled snapshot meanwhile). The index is a pure pointer catalog
  // — no usage stats; install counts come from a separate public API.
  const [data, setData] = useState(null);
  // Minimal client routing: browse (find page) <-> detail (a collection).
  const [view, setView] = useState({ name: 'browse' });
  // Publish modal (collects metadata → emits the registry entry to PR).
  const [showPublish, setShowPublish] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchRegistryIndex()
      .then((d) => alive && setData(d))
      .catch((err) => console.error('[web] registry index load failed', err));
    return () => { alive = false; };
  }, []);

  const openCollection = (c) => setView({ name: 'detail', collection: c });
  const goBrowse = () => setView({ name: 'browse' });

  const handleSearch = (q, filters) => {
    // Website behavior: navigate to /search?q=… . Stubbed until routing lands.
    console.log('[web] search', { q, filters });
  };

  // A truthful install command for the open collection's latest version.
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

  // Install (website) = open the latest version's artifact. For git, copy a
  // clone command; for url, navigate to the hosted opencollection.yml.
  const handleInstall = (c) => {
    const v = latestVersionEntry(c);
    if (!v) return;
    if (v.type === 'url' && v.source?.url) {
      window.open(v.source.url, '_blank', 'noopener');
      return;
    }
    const g = gitSourceOf(v);
    if (g && navigator.clipboard) navigator.clipboard.writeText(`git clone ${g.repo}`).catch(() => {});
  };

  const detailCollection = view.name === 'detail' ? view.collection : null;

  return (
    <div className="oc-registry" style={{ height: '100vh', width: '100%', display: 'flex', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <Sidebar active="browse" onSelect={goBrowse} onPublish={() => setShowPublish(true)} />
      <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
        {view.name === 'detail' ? (
          <CollectionDetailPage
            collection={detailCollection}
            onBack={goBrowse}
            onInstall={() => handleInstall(detailCollection)}
            installLabel="Add to Bruno"
            installCommand={installCommandFor(detailCollection)}
          />
        ) : (
          <FindAndSharePage
            onOpenCollection={openCollection}
            onSearch={handleSearch}
            registryData={deriveHome(data)}
          />
        )}
      </div>

      {showPublish && (
        <PublishCollectionModal
          onClose={() => setShowPublish(false)}
          onPublish={(result) => console.log('[web] publish', result)}
        />
      )}
    </div>
  );
}
