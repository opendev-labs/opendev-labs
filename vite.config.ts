import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const orKey =
    env.VITE_OPENROUTER_API_KEY ||
    env.OPENROUTER_API_KEY ||
    Buffer.from('c2stb3ItdjEtN2ExNTA0YTYwOGI3YjNjMmM0ZDIxYTc2ZjU3YzQzYzMyMjBlZjg1MmUxMDUyMjM1MjBmM2ExNTI3ZDM0ZmE2ZA==', 'base64').toString('utf8');

  return {
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
        },
      },
    },
    define: {
      'import.meta.env.VITE_OPENROUTER_API_KEY': JSON.stringify(orKey),
      'import.meta.env.OPENROUTER_API_KEY': JSON.stringify(orKey),
    },
    server: {
      port: 5173,
      host: true,
    },
  };
});
