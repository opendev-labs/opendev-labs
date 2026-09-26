import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Separate Vite config for openstudio.opendev-labs.com
// This project resolves shared code from the parent monorepo (../src)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow this sub-project to import from the parent's src directory
      '@studio': path.resolve(__dirname, '../src/features/studio'),
      '@lib': path.resolve(__dirname, '../src/lib'),
      '@context': path.resolve(__dirname, '../src/context'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@services': path.resolve(__dirname, '../src/services'),
      '@': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
