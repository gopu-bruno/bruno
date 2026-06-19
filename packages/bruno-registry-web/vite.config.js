import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Standalone Vite app — intentionally NOT part of the root npm workspaces, so
// its install/build stays isolated from the rest of the monorepo.
//
// @usebruno/registry-ui is the shared component package. bruno-app consumes its
// built dist (its bundler doesn't transpile node_modules); the website instead
// aliases the bare specifier straight to the package SOURCE, so editing a shared
// component hot-reloads here with no rebuild step.
const registryUiSrc = fileURLToPath(new URL('../bruno-registry-ui/src', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@usebruno/registry-ui/tokens.css', replacement: `${registryUiSrc}/tokens.css` },
      { find: '@usebruno/registry-ui', replacement: `${registryUiSrc}/index.js` },
    ],
  },
  server: {
    port: 5174,
    open: true,
    // Allow importing the shared package's source, which lives in a sibling dir.
    fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] },
  },
});
