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
  // Vercel "Config" variables (without VITE_ prefix) are injected at build time.
  // We map them here so import.meta.env.VITE_* still works in the browser code.
  define: {
    'import.meta.env.VITE_OPENROUTER_API_KEY': JSON.stringify(
      process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || ''
    ),
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
      process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
    ),
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
