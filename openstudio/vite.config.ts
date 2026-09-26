import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Standalone Vite config for openstudio.opendev-labs.com
// All shared code is self-contained inside openstudio/ (no ../src references)
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@studio': path.resolve(__dirname, './studio'),
      '@lib': path.resolve(__dirname, './lib'),
      '@context': path.resolve(__dirname, './context'),
      '@components': path.resolve(__dirname, './components'),
      '@services': path.resolve(__dirname, './services'),
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      // @mlc-ai/web-llm is dynamically imported only when user picks a local model.
      // It's WASM-heavy — mark external so Rollup doesn't try to bundle it.
      external: ['@mlc-ai/web-llm'],
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
