import React, { useState, useMemo, useEffect } from 'react';
import {
  SandpackProvider,
  SandpackPreview as SandpackPreviewComponent,
  SandpackLayout,
  SandpackConsole,
} from '@codesandbox/sandpack-react';
import type { FileNode } from '../types';
import { SpinnerIcon } from './icons/Icons';
import { cn } from '../../../lib/utils';

interface LiveDevBoxPreviewProps {
  files: FileNode[];
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';
type PreviewEngine = 'sandpack' | 'devbox';

// Modules to exclude from auto dependency detection
const BUILT_IN_MODULES = new Set([
  'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime',
  'fs', 'path', 'os', 'url', 'util', 'events', 'stream', 'http', 'https',
  'crypto', 'child_process', 'buffer', 'querystring', 'assert', 'zlib',
]);

const EXCLUDED_PACKAGES = new Set([
  'webpack', 'vite', 'esbuild', 'rollup', 'parcel',
  'typescript', 'ts-node', 'nodemon', 'pm2',
  'tailwindcss', 'postcss', 'autoprefixer',
]);

function detectDependencies(files: FileNode[]): Record<string, string> {
  const deps: Record<string, string> = {
    'lucide-react': 'latest',
    'framer-motion': 'latest',
    'clsx': 'latest',
    'tailwind-merge': 'latest',
  };

  const importRegex = /(?:import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"./][^'"]*?)(?:\/[^'"]*)?['"]|require\s*\(\s*['"]([^'"./][^'"]*?)(?:\/[^'"]*)?['"]\s*\))/g;

  for (const file of files) {
    if (!file.content) continue;
    if (!/\.(tsx?|jsx?|vue|svelte|mjs|cjs)$/.test(file.path)) continue;

    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(file.content)) !== null) {
      const pkg = match[1] || match[2];
      if (!pkg) continue;

      const rootPkg = pkg.startsWith('@')
        ? pkg.split('/').slice(0, 2).join('/')
        : pkg.split('/')[0];

      if (!BUILT_IN_MODULES.has(rootPkg) && !EXCLUDED_PACKAGES.has(rootPkg)) {
        deps[rootPkg] = 'latest';
      }
    }
  }

  return deps;
}

function convertFiles(files: FileNode[]): Record<string, string> {
  const sandpackFiles: Record<string, string> = {};

  for (const file of files) {
    const path = file.path.startsWith('/') ? file.path : `/${file.path}`;
    if (path.endsWith('.keep')) continue;
    sandpackFiles[path] = file.content || '';
  }

  // Ensure dark mode index.css exists if not present
  if (!sandpackFiles['/src/index.css'] && !sandpackFiles['/index.css']) {
    sandpackFiles['/src/index.css'] = `@import "tailwindcss";
body {
  margin: 0;
  padding: 0;
  background-color: #050505;
  color: #f4f4f5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
}`;
  }

  // Ensure index.html includes Tailwind CSS CDN for instant rendering
  if (!sandpackFiles['/index.html']) {
    sandpackFiles['/index.html'] = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <title>OpenStudio Workspace Preview</title>
  </head>
  <body class="bg-[#050505] text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }

  // Ensure React entry points exist
  const hasIndex = Object.keys(sandpackFiles).some(p =>
    /^\/?(src\/)?(main|index)\.(tsx|jsx|ts|js)$/.test(p)
  );
  const hasApp = Object.keys(sandpackFiles).some(p =>
    /^\/?(src\/)?App\.(tsx|jsx)$/.test(p)
  );

  if (hasApp && !hasIndex) {
    const appPath = Object.keys(sandpackFiles).find(p =>
      /^\/?(src\/)?App\.(tsx|jsx)$/.test(p)
    );
    const appImport = appPath?.replace(/^\//, '').replace(/\.(tsx|jsx)$/, '');

    sandpackFiles['/src/main.tsx'] = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../${appImport}';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
`;
  }

  return sandpackFiles;
}

function findEntryFile(files: Record<string, string>): string {
  const priorities = [
    '/src/main.tsx', '/src/index.tsx', '/src/App.tsx',
    '/src/main.jsx', '/src/index.jsx', '/src/App.jsx',
    '/index.html',
  ];

  for (const p of priorities) {
    if (files[p]) return p;
  }

  return Object.keys(files)[0] || '/src/App.tsx';
}

export function LiveDevBoxPreview({ files }: LiveDevBoxPreviewProps) {
  const [engine, setEngine] = useState<PreviewEngine>('sandpack');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [showConsole, setShowConsole] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [devboxMode, setDevboxMode] = useState<'app' | 'ide'>('app');
  const officialDevboxUrl = "https://codesandbox.io/p/devbox/opendev-io-dswngy";
  const officialAppUrl = "https://dswngy-5173.csb.app/";

  const deps = useMemo(() => detectDependencies(files), [files]);
  const sandpackFiles = useMemo(() => convertFiles(files), [files]);
  const entryFile = useMemo(() => findEntryFile(sandpackFiles), [sandpackFiles]);

  // Viewport width styling
  const viewportWidthClass = 
    viewport === 'mobile' ? 'max-w-[375px] my-4 shadow-2xl rounded-2xl border border-zinc-800' :
    viewport === 'tablet' ? 'max-w-[768px] my-4 shadow-2xl rounded-2xl border border-zinc-800' :
    'w-full h-full';

  return (
    <div className="flex flex-col h-full bg-[#050505] overflow-hidden">
      {/* 🌐 GOOGLE AI STUDIO STYLE PROFESSIONAL BROWSER FRAME */}
      <div className="h-10 bg-[#09090b] border-b border-zinc-800 flex items-center justify-between px-3 z-20 shrink-0 select-none">
        {/* LEFT: WINDOW CONTROLS & ADDRESS BAR */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-3">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>

          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            title="Refresh Live Preview"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.037 8.037 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* ADDRESS BAR WITH SSL LOCK ICON & POPOUT ACTION */}
          <div className="flex-1 max-w-lg bg-[#050505] border border-zinc-800 rounded-lg h-6.5 flex items-center justify-between px-2.5 shadow-inner">
            <div className="flex items-center gap-2 min-w-0">
              <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[10px] text-zinc-300 font-mono truncate tracking-tight">
                {engine === 'devbox' 
                  ? (devboxMode === 'app' ? officialAppUrl : officialDevboxUrl)
                  : 'http://localhost:5173'}
              </span>
            </div>
            <a
              href={engine === 'devbox' ? (devboxMode === 'app' ? officialAppUrl : officialDevboxUrl) : '#'}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors p-0.5"
              title="Open in new window"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* RIGHT: ENGINE TOGGLE, DEVBOX MODE, VIEWPORT SWITCHER, CONSOLE */}
        <div className="flex items-center gap-2 shrink-0">
          {engine === 'devbox' && (
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setDevboxMode('app')}
                className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all", devboxMode === 'app' ? "bg-white text-black" : "text-zinc-400 hover:text-white")}
              >
                APP
              </button>
              <button
                onClick={() => setDevboxMode('ide')}
                className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all", devboxMode === 'ide' ? "bg-[#f02050] text-white" : "text-zinc-400 hover:text-white")}
              >
                DEVBOX IDE
              </button>
            </div>
          )}

          {/* VIEWPORT SWITCHER */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewport('desktop')}
              className={cn("px-2 py-1 rounded text-[10px] font-bold transition-all", viewport === 'desktop' ? "bg-white text-black" : "text-zinc-400 hover:text-white")}
              title="Desktop View"
            >
              💻
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={cn("px-2 py-1 rounded text-[10px] font-bold transition-all", viewport === 'tablet' ? "bg-white text-black" : "text-zinc-400 hover:text-white")}
              title="Tablet View"
            >
              📱
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={cn("px-2 py-1 rounded text-[10px] font-bold transition-all", viewport === 'mobile' ? "bg-white text-black" : "text-zinc-400 hover:text-white")}
              title="Mobile View"
            >
              📲
            </button>
          </div>

          {/* ENGINE TOGGLE */}
          <button
            onClick={() => setEngine(engine === 'sandpack' ? 'devbox' : 'sandpack')}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all border flex items-center gap-1.5",
              engine === 'devbox'
                ? "bg-[#f02050]/10 border-[#f02050]/40 text-[#f02050]"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            )}
          >
            <span>{engine === 'devbox' ? '⚡ CodeDevBox VM' : '🚀 Fast Sandpack'}</span>
          </button>

          {/* CONSOLE TOGGLE */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
              showConsole ? "bg-zinc-800 border-zinc-700 text-white" : "border-zinc-800 text-zinc-400 hover:text-white"
            )}
          >
            Console
          </button>
        </div>
      </div>

      {/* 🚀 PREVIEW CONTAINER */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center bg-[#000000] overflow-hidden">
        <div className={cn("transition-all duration-300 mx-auto h-full flex flex-col justify-center", viewportWidthClass)}>
          {engine === 'devbox' ? (
            <div className="w-full h-full relative bg-black">
              <iframe
                key={refreshKey}
                src={devboxMode === 'ide' ? "https://codesandbox.io/p/devbox/opendev-io-dswngy?embed=1" : "https://dswngy-5173.csb.app/"}
                className="w-full h-full border-0"
                title="CodeDevBox Live VM"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              />
            </div>
          ) : (
            <SandpackProvider
              key={refreshKey}
              template="vite-react-ts"
              files={sandpackFiles}
              customSetup={{
                dependencies: deps,
                entry: entryFile,
              }}
              options={{
                autorun: true,
                recompileMode: 'delayed',
                recompileDelay: 400,
                externalResources: [
                  'https://cdn.tailwindcss.com',
                  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
                ],
              }}
              theme="dark"
            >
              <SandpackLayout style={{ height: '100%', border: 'none', borderRadius: 0, background: '#050505' }}>
                <div className="flex flex-col h-full w-full">
                  <SandpackPreviewComponent
                    style={{ height: '100%', flex: 1 }}
                    showNavigator={false}
                    showRefreshButton={false}
                    showOpenInCodeSandbox={false}
                  />
                  {showConsole && (
                    <div className="h-40 border-t border-zinc-800 bg-[#09090b] font-mono text-xs">
                      <SandpackConsole style={{ height: '100%', backgroundColor: '#09090b' }} />
                    </div>
                  )}
                </div>
              </SandpackLayout>
            </SandpackProvider>
          )}
        </div>
      </div>
    </div>
  );
}
