import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        login: path.resolve(__dirname, 'login.html'),
        signup: path.resolve(__dirname, 'signup.html'),
        auth: path.resolve(__dirname, 'auth.html'),
        dashboard: path.resolve(__dirname, 'dashboard.html'),
        newProject: path.resolve(__dirname, 'new-project.html'),
        projectDetail: path.resolve(__dirname, 'project-detail.html'),
        booking: path.resolve(__dirname, 'booking.html'),
        previewEbookstall: path.resolve(__dirname, 'preview-ebookstall.html'),
        domains: path.resolve(__dirname, 'domains.html'),
        pricing: path.resolve(__dirname, 'pricing.html'),
        marketplace: path.resolve(__dirname, 'marketplace.html'),
        aiCloud: path.resolve(__dirname, 'ai-cloud.html'),
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
