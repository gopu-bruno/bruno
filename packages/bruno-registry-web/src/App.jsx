// Website host for the registry UI.
//
// This file is the web-specific glue: it imports the shared design tokens,
// fetches the live git-backed registry index, lays out the app shell (sidebar +
// content), and wires website behavior into the shared components' callbacks.
// bruno-app would have its own equivalent host (open a detail tab, install into
// the workspace) reusing the same registry-ui components unchanged.
import React, { useEffect, useState } from 'react';
import './registry-ui/tokens.css';
import { Sidebar, FindAndSharePage, CollectionDetailPage, fetchRegistryIndex } from './registry-ui/index.js';

export default function App() {
  // Live data from the git-backed index; null until it resolves (page falls
  // back to its bundled snapshot meanwhile).
  const [data, setData] = useState(null);
  // Minimal client routing: browse (find page) <-> detail (a collection).
  const [view, setView] = useState({ name: 'browse' });

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

  const handleInstall = (c) => {
    // Website behavior: copy the install command (the app host installs for real).
    const cmd = `bruno install ${c.ns}/${c.name}`;
    if (navigator.clipboard) navigator.clipboard.writeText(cmd).catch(() => {});
    console.log('[web] install', cmd);
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <Sidebar active="browse" onSelect={goBrowse} />
      <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
        {view.name === 'detail' ? (
          <CollectionDetailPage
            collection={view.collection}
            onBack={goBrowse}
            onInstall={() => handleInstall(view.collection)}
          />
        ) : (
          <FindAndSharePage
            onOpenCollection={openCollection}
            onSearch={handleSearch}
            registryData={data}
          />
        )}
      </div>
    </div>
  );
}
