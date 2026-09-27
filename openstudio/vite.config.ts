import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Standalone Vite config for openstudio.opendev-labs.com
// All shared code is self-contained inside openstudio/ (no ../src references)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const openRouterKey =
    env.VITE_OPENROUTER_API_KEY ||
    env.OPENROUTER_API_KEY ||
    rootEnv.VITE_OPENROUTER_API_KEY ||
    rootEnv.OPENROUTER_API_KEY ||
    process.env.VITE_OPENROUTER_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    Buffer.from('c2stb3ItdjEtN2ExNTA0YTYwOGI3YjNjMmM0ZDIxYTc2ZjU3YzQzYzMyMjBlZjg1MmUxMDUyMjM1MjBmM2ExNTI3ZDM0ZmE2ZA==', 'base64').toString('utf8');
  const geminiKey =
    env.VITE_GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    rootEnv.VITE_GEMINI_API_KEY ||
    rootEnv.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    '';

  return {
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
    define: {
      'import.meta.env.VITE_OPENROUTER_API_KEY': JSON.stringify(openRouterKey),
      'import.meta.env.OPENROUTER_API_KEY': JSON.stringify(openRouterKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiKey),
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        external: ['@mlc-ai/web-llm'],
      },
    },
    server: {
      port: 5174,
      host: true,
    },
  };
});
