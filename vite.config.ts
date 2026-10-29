import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import app from './api/index.ts';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const expressApiPlugin = (): Plugin => ({
  name: 'express-api-plugin',
  configureServer(server) {
    server.middlewares.use(app);
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
