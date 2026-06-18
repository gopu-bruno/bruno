import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone Vite app — intentionally NOT part of the root npm workspaces yet,
// so its install/build stays isolated from the rest of the monorepo.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
  },
});
