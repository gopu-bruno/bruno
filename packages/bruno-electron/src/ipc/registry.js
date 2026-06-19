const { ipcMain } = require('electron');
const axios = require('axios');

// Default registry index location — the rate-limit-free raw CDN URL. Kept in
// sync with REGISTRY_INDEX_RAW_URL in @usebruno/registry-ui; the renderer passes
// the canonical URL, this is just a fallback.
const DEFAULT_REGISTRY_INDEX_URL
  = 'https://raw.githubusercontent.com/gopu-bruno/collection-registry/main/index.json';

const registerRegistryIpc = (mainWindow) => {
  // Fetch the registry index from the MAIN process.
  //
  // Why not fetch from the renderer (like the website does)? The renderer CSP
  // restricts connect-src to 'self', so an external fetch is blocked. The main
  // process has no such restriction and isn't subject to CORS — and we point it
  // at raw.githubusercontent.com, which has no API rate limit (great for demos).
  ipcMain.handle('renderer:fetch-registry-index', async (event, { url } = {}) => {
    const target = url || DEFAULT_REGISTRY_INDEX_URL;
    const res = await axios.get(target, {
      // raw CDN caches for ~5 min; bypass any local cache so refreshes are fresh.
      headers: { 'Cache-Control': 'no-cache' },
      responseType: 'json',
      timeout: 30000,
      validateStatus: (status) => status >= 200 && status < 300
    });
    return res.data;
  });
};

module.exports = registerRegistryIpc;
