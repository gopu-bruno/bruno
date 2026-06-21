// Website host for the registry UI.
//
// This file is the web-specific glue: it imports the shared design tokens,
// fetches the live git-backed registry index, lays out the app shell (sidebar +
// content), and wires website behavior into the shared components' callbacks.
// bruno-app would have its own equivalent host (open a detail tab, install into
// the workspace) reusing the same registry-ui components unchanged.
import React, { useEffect, useState } from 'react';
import '@usebruno/registry-ui/tokens.css';
import { Sidebar, FindAndSharePage, CollectionDetailPage, fetchRegistryIndex, fetchCollectionReleases } from '@usebruno/registry-ui';

export default function App() {
  // Live data from the git-backed index; null until it resolves (page falls
  // back to its bundled snapshot meanwhile). The index already carries
  // CI-baked usage stats (version/downloads/releases) read from GitHub.
  const [data, setData] = useState(null);
  // Minimal client routing: browse (find page) <-> detail (a collection).
  const [view, setView] = useState({ name: 'browse' });
  // Fresh release stats for the open collection, re-fetched live from GitHub so
  // the install count on the detail page is current (not just the last CI build).
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchRegistryIndex()
      .then((d) => alive && setData(d))
      .catch((err) => console.error('[web] registry index load failed', err));
    return () => { alive = false; };
  }, []);

  // Re-fetch release stats whenever a collection's detail page opens. Cached per
  // session (see fetchCollectionReleases); pass force after an install so the
  // fresh count isn't served from cache.
  const refreshStats = (collection, force = false) => {
    fetchCollectionReleases(collection, { force })
      .then((s) => s && setLiveStats({ slug: `${collection.ns}/${collection.name}`, ...s }))
      .catch((err) => console.warn('[web] release stats fetch failed', err));
  };

  const openCollection = (c) => {
    setLiveStats(null);
    setView({ name: 'detail', collection: c });
    refreshStats(c);
  };
  const goBrowse = () => { setView({ name: 'browse' }); setLiveStats(null); };

  const handleSearch = (q, filters) => {
    // Website behavior: navigate to /search?q=… . Stubbed until routing lands.
    console.log('[web] search', { q, filters });
  };

  // Install = download the latest release's opencollection.yml artifact. GitHub
  // counts that download on the asset, which is exactly the install metric we
  // show. After the download, re-fetch so the bump is reflected.
  const handleInstall = (collection, stats) => {
    const assetUrl = stats && stats.latestAssetUrl;
    if (assetUrl) {
      const a = document.createElement('a');
      a.href = assetUrl;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => refreshStats(collection, true), 2000);
      return;
    }
    // No published release yet — fall back to copying a git clone of the source.
    const repo = collection.source && collection.source.repo;
    if (repo && navigator.clipboard) navigator.clipboard.writeText(`git clone ${repo}`).catch(() => {});
    console.log('[web] no release asset; copied git clone', repo);
  };

  // Merge live stats into the open collection so the detail page renders the
  // freshest numbers; until they arrive it shows the index-baked values.
  const detailCollection = (() => {
    if (view.name !== 'detail') return null;
    const c = view.collection;
    if (liveStats && liveStats.slug === `${c.ns}/${c.name}`) {
      const { slug, ...stats } = liveStats;
      return { ...c, ...stats };
    }
    return c;
  })();

  return (
    <div className="oc-registry" style={{ height: '100vh', width: '100%', display: 'flex', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <Sidebar active="browse" onSelect={goBrowse} />
      <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
        {view.name === 'detail' ? (
          <CollectionDetailPage
            collection={detailCollection}
            onBack={goBrowse}
            onInstall={() => handleInstall(detailCollection, detailCollection)}
            installLabel={detailCollection.latestAssetUrl ? 'Get collection' : 'Add to Bruno'}
            installCommand={detailCollection.latestAssetUrl
              ? `curl -L ${detailCollection.latestAssetUrl} -o opencollection.yml`
              : undefined}
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
