import React, { useState, useMemo, useEffect } from 'react';
import {
  SandpackProvider,
  SandpackPreview as SandpackPreviewComponent,
  SandpackLayout,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react';
import type { FileNode } from '../types';
import { SpinnerIcon } from './icons/Icons';
import { cn } from '../../lib/utils';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Terminal,
  Check,
} from 'lucide-react';

interface LiveDevBoxPreviewProps {
  files: FileNode[];
  onFixError?: (errorPrompt: string) => void;
}

function SandpackTarsWatcher({ onFixError }: { onFixError?: (prompt: string) => void }) {
  const { sandpack, listen } = useSandpack();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (sandpack.error) {
      setErrorMsg(sandpack.error.message || 'Compilation or runtime error in preview');
    } else {
      setErrorMsg(null);
    }
  }, [sandpack.error]);

  useEffect(() => {
    const unsubscribe = listen((msg: any) => {
      if (msg.type === 'action' && msg.action === 'show-error') {
        setErrorMsg(msg.message || 'Error occurred in preview runtime');
      } else if (msg.type === 'console' && msg.log && Array.isArray(msg.log)) {
        const errorLog = msg.log.find((l: any) => l.method === 'error');
        if (errorLog && errorLog.data) {
          const text = errorLog.data.map((d: any) => (typeof d === 'string' ? d : JSON.stringify(d))).join(' ');
          if (text && !text.includes('Download the React DevTools')) {
            setErrorMsg(text);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [listen]);

  if (!errorMsg) return null;

  return (
    <div className="absolute bottom-3 left-3 right-3 z-40 p-2.5 rounded-xl bg-red-950/90 border border-red-500/40 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
        <div className="truncate">
          <span className="font-bold text-red-200">TARS Console Alert: </span>
          <span className="text-red-300 font-mono text-[11px] truncate">{errorMsg}</span>
        </div>
      </div>
      <button
        onClick={() => {
          if (onFixError) {
            onFixError(`TARS Console & Terminal Error: "${errorMsg}". Please inspect the workspace code, fix the syntax/runtime/dependency errors, and rebuild cleanly.`);
          }
        }}
        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-[10px] tracking-wide shrink-0 transition-all shadow-lg hover:shadow-red-500/25 flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
        ⚡ Fix with TARS
      </button>
    </div>
  );
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

function extractPackageName(rawImport: string): string | null {
  if (!rawImport || rawImport.startsWith('.') || rawImport.startsWith('/')) {
    return null;
  }
  const parts = rawImport.trim().split('/');
  if (rawImport.startsWith('@')) {
    // Scoped package: needs at least 2 parts (e.g., @scope/pkg)
    if (parts.length >= 2 && parts[1]) {
      return `${parts[0]}/${parts[1]}`;
    }
    return null; // Bare @scope is not an installable package
  }
  return parts[0];
}

function detectDependencies(files: FileNode[]): Record<string, string> {
  const deps: Record<string, string> = {
    'lucide-react': 'latest',
    'framer-motion': 'latest',
    'clsx': 'latest',
    'tailwind-merge': 'latest',
    '@iconify/react': 'latest',
  };

  const importRegex = /(?:import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"./][^'"]+)['"]|require\s*\(\s*['"]([^'"./][^'"]+)['"]\s*\))/g;

  for (const file of files) {
    if (!file.content) continue;
    if (!/\.(tsx?|jsx?|vue|svelte|mjs|cjs)$/.test(file.path)) continue;

    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(file.content)) !== null) {
      const rawPkg = match[1] || match[2];
      const pkg = extractPackageName(rawPkg);
      if (!pkg) continue;

      if (!BUILT_IN_MODULES.has(pkg) && !EXCLUDED_PACKAGES.has(pkg)) {
        deps[pkg] = 'latest';
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
    sandpackFiles['/src/index.css'] = `body {
  margin: 0;
  padding: 0;
  background-color: #050505;
  color: #f4f4f5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
}`;
  }

  // Sanitize all CSS files to prevent Vite PostCSS from failing when looking for npm package 'tailwindcss'
  // Tailwind is loaded globally via CDN in index.html
  for (const path of Object.keys(sandpackFiles)) {
    if (path.endsWith('.css') && typeof sandpackFiles[path] === 'string') {
      sandpackFiles[path] = sandpackFiles[path]
        .replace(/@import\s+['"]tailwindcss['"];?/g, '/* tailwindcss loaded via CDN */')
        .replace(/@import\s+['"]tailwindcss\/[^'"]+['"];?/g, '/* tailwindcss loaded via CDN */')
        .replace(/@tailwind\s+[a-zA-Z]+;?/g, '/* tailwindcss loaded via CDN */');
    }

    // Normalize any bare @iconify imports to @iconify/react
    if (/\.(tsx?|jsx?|js|ts)$/.test(path) && typeof sandpackFiles[path] === 'string') {
      sandpackFiles[path] = sandpackFiles[path].replace(/from\s+['"]@iconify['"]/g, "from '@iconify/react'");
    }
  }

  // Common brand icons hallucinated from lucide-react (which doesn't export them)
  const BRAND_ICON_SVGS: Record<string, string> = {
    Google: `const Google = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);
const GoogleIcon = Google;`,
    Apple: `const Apple = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.76 1.04-1.82.93-2.87-.9.04-2 .6-2.65 1.36-.57.66-1.07 1.73-.93 2.76 1.01.08 2.03-.49 2.65-1.25z"/>
  </svg>
);
const AppleIcon = Apple;`,
    Facebook: `const Facebook = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);
const FacebookIcon = Facebook;`,
    Twitter: `const Twitter = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const TwitterIcon = Twitter;`,
    Microsoft: `const Microsoft = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M1 1h10v10H1z" fill="#f25022"/>
    <path d="M13 1h10v10H13z" fill="#7fba00"/>
    <path d="M1 13h10v10H1z" fill="#00a4ef"/>
    <path d="M13 13h10v10H1z" fill="#ffb900"/>
  </svg>
);
const MicrosoftIcon = Microsoft;`,
    Discord: `const Discord = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="#5865F2"/>
  </svg>
);
const DiscordIcon = Discord;`,
    Linkedin: `const Linkedin = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#0A66C2"/>
  </svg>
);
const LinkedIn = Linkedin;
const LinkedinIcon = Linkedin;`,
  };

  // Sanitize lucide-react brand imports across all script/component files
  for (const path of Object.keys(sandpackFiles)) {
    if (/\.(tsx?|jsx?|js|ts)$/.test(path) && typeof sandpackFiles[path] === 'string') {
      let code = sandpackFiles[path];
      const injectedIcons = new Set<string>();

      code = code.replace(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?/g, (fullImport, importList) => {
        const identifiers = importList.split(',').map((s: string) => s.trim()).filter(Boolean);
        const retained: string[] = [];

        for (const item of identifiers) {
          const baseName = item.split(/\s+as\s+/)[0].trim();
          const matchedKey = Object.keys(BRAND_ICON_SVGS).find(
            k => k.toLowerCase() === baseName.toLowerCase() || (k + 'icon').toLowerCase() === baseName.toLowerCase()
          );

          if (matchedKey) {
            injectedIcons.add(matchedKey);
          } else {
            retained.push(item);
          }
        }

        if (retained.length === 0) {
          return '/* lucide brand icons replaced with inline SVGs */';
        }
        return `import { ${retained.join(', ')} } from 'lucide-react';`;
      });

      if (injectedIcons.size > 0) {
        const iconDefs = Array.from(injectedIcons).map(k => BRAND_ICON_SVGS[k]).join('\n');
        code = `${iconDefs}\n\n${code}`;
      }

      // Ensure App.tsx has an export default if it defines function App
      if (path.endsWith('App.tsx') || path.endsWith('App.jsx')) {
        if (!code.includes('export default') && (code.includes('function App') || code.includes('const App'))) {
          code += '\nexport default App;\n';
        }
      }

      sandpackFiles[path] = code;
    }
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

  // Purge any leaked JSON from code files
  for (const [p, c] of Object.entries(sandpackFiles)) {
    if (/\.(tsx?|jsx?|js|ts)$/.test(p)) {
      const trimmed = (c || '').trim();
      if (trimmed.startsWith('{') && (trimmed.includes('"conversation"') || trimmed.includes('"files"'))) {
        delete sandpackFiles[p];
      }
    }
  }

  // Check if project is React or pure Vanilla HTML
  const hasValidApp = Object.keys(sandpackFiles).some(p => {
    if (!/^\/?(src\/)?App\.(tsx|jsx)$/.test(p)) return false;
    const c = (sandpackFiles[p] || '').trim();
    if (c.startsWith('{')) return false;
    return (c.includes('export default') || c.includes('function App') || c.includes('const App') || c.includes('return <') || c.includes('return ('));
  });

  const hasIndexHtml = !!sandpackFiles['/index.html'] && (
    sandpackFiles['/index.html'].includes('<!DOCTYPE') ||
    sandpackFiles['/index.html'].includes('<html') ||
    sandpackFiles['/index.html'].includes('<body') ||
    sandpackFiles['/index.html'].includes('<div')
  );

  // If user requested vanilla HTML and generated index.html without a valid React App
  if (hasIndexHtml && !hasValidApp) {
    // Purge any phantom or corrupt React entry files so Sandpack runs pure static HTML
    delete sandpackFiles['/src/App.tsx'];
    delete sandpackFiles['/App.tsx'];
    delete sandpackFiles['/src/App.jsx'];
    delete sandpackFiles['/App.jsx'];
    delete sandpackFiles['/src/main.tsx'];
    delete sandpackFiles['/src/index.tsx'];
    delete sandpackFiles['/src/main.jsx'];
    delete sandpackFiles['/src/index.jsx'];

    // Ensure index.html has Tailwind CDN
    if (!sandpackFiles['/index.html'].includes('cdn.tailwindcss.com')) {
      sandpackFiles['/index.html'] = sandpackFiles['/index.html'].replace(
        /<head[^>]*>/i,
        `<head>\n    <script src="https://cdn.tailwindcss.com"></script>`
      );
    }
    if (!sandpackFiles['/index.html'].includes('class="dark"') && !sandpackFiles['/index.html'].includes("class='dark'")) {
      sandpackFiles['/index.html'] = sandpackFiles['/index.html'].replace(
        /<html([^>]*)>/i,
        `<html$1 class="dark">`
      );
    }
    return sandpackFiles;
  }

  // Resilient React entry points (handles default, named App, Application, Main exports)
  const entryCode = `import React from 'react';
import { createRoot } from 'react-dom/client';
import * as AppModule from './App';
import './index.css';

const AppComponent = 
  AppModule.default || 
  (AppModule as any).App || 
  (AppModule as any).Application || 
  (AppModule as any).Main || 
  Object.values(AppModule).find(v => typeof v === 'function' || (typeof v === 'object' && v !== null && (v as any).$$typeof)) || 
  (() => (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff', background: '#09090b', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Workspace App Loaded</h2>
      <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Component ready in ./App</p>
    </div>
  ));

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(AppComponent));
}
`;

  sandpackFiles['/src/index.tsx'] = entryCode;
  sandpackFiles['/src/main.tsx'] = entryCode;

  return sandpackFiles;
}

function findEntryFile(files: Record<string, string>, isVanilla: boolean): string {
  if (isVanilla) return '/index.html';
  const priorities = [
    '/src/index.tsx', '/index.tsx', '/src/main.tsx', '/src/App.tsx',
    '/src/index.jsx', '/index.jsx', '/src/main.jsx', '/src/App.jsx',
    '/index.html',
  ];

  for (const p of priorities) {
    if (files[p]) return p;
  }

  return Object.keys(files)[0] || '/src/App.tsx';
}

export function LiveDevBoxPreview({ files, onFixError }: LiveDevBoxPreviewProps) {
  const [engine, setEngine] = useState<PreviewEngine>('sandpack');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [showConsole, setShowConsole] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [devboxMode, setDevboxMode] = useState<'app' | 'ide'>('app');
  const officialDevboxUrl = "https://codesandbox.io/p/devbox/opendev-io-dswngy";
  const officialAppUrl = "https://dswngy-5173.csb.app/";

  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    const urlToCopy = engine === 'devbox'
      ? (devboxMode === 'app' ? officialAppUrl : officialDevboxUrl)
      : (typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:5173');
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const deps = useMemo(() => detectDependencies(files), [files]);
  const sandpackFiles = useMemo(() => convertFiles(files), [files]);
  const isVanilla = useMemo(() => {
    const hasValidApp = Object.keys(sandpackFiles).some(p => {
      if (!/^\/?(src\/)?App\.(tsx|jsx)$/.test(p)) return false;
      const c = (sandpackFiles[p] || '').trim();
      if (c.startsWith('{')) return false;
      return c.includes('export default') || c.includes('function App') || c.includes('const App');
    });
    return !hasValidApp && !!sandpackFiles['/index.html'];
  }, [sandpackFiles]);
  const entryFile = useMemo(() => findEntryFile(sandpackFiles, isVanilla), [sandpackFiles, isVanilla]);

  // Auto-select engine: DevBox VM for Python backends, Fast Sandpack for Frontend webapps
  const isPython = useMemo(() => {
    return files.some(f => f.path.endsWith('.py') || f.path.includes('requirements.txt') || f.path.includes('Pipfile'));
  }, [files]);

  useEffect(() => {
    if (isPython) {
      setEngine('devbox');
    }
  }, [isPython]);

  // Viewport width styling
  const viewportWidthClass = 
    viewport === 'mobile' ? 'max-w-[375px] my-4 shadow-2xl rounded-2xl border border-zinc-800' :
    viewport === 'tablet' ? 'max-w-[768px] my-4 shadow-2xl rounded-2xl border border-zinc-800' :
    'w-full h-full';

  return (
    <div className="flex flex-col h-full bg-[#050505] overflow-hidden">
      {/* 🚀 MODERN INTERACTIVE CANVAS TOOLBAR (v0 / Bolt / Lovable Style) */}
      <header className="h-11 w-full border-b border-zinc-800 bg-zinc-950/80 px-3 backdrop-blur-md flex items-center justify-between select-none shrink-0 z-20">
        {/* Left: Route Indicator & Reload */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            title="Reload preview"
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Minimal path pill instead of ugly localhost URL */}
          <button
            onClick={copyUrl}
            title="Click to copy URL"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800/80 rounded-md hover:border-zinc-700 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{engine === 'devbox' ? (devboxMode === 'app' ? 'app.devbox.io' : 'ide.devbox.io') : 'localhost:5173'}</span>
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
          </button>
        </div>

        {/* Center: Clean Segmented Viewport Switcher */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 p-0.5 rounded-lg shadow-inner">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-all ${
              viewport === 'desktop'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-all ${
              viewport === 'tablet'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Tablet"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-all ${
              viewport === 'mobile'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Mobile"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Utility Actions */}
        <div className="flex items-center gap-1.5">
          {engine === 'devbox' && (
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md p-0.5 mr-0.5">
              <button
                onClick={() => setDevboxMode('app')}
                className={cn("px-2 py-0.5 rounded text-[10px] font-medium transition-all", devboxMode === 'app' ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-200")}
              >
                App
              </button>
              <button
                onClick={() => setDevboxMode('ide')}
                className={cn("px-2 py-0.5 rounded text-[10px] font-medium transition-all", devboxMode === 'ide' ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-200")}
              >
                IDE
              </button>
            </div>
          )}

          {/* Console Button */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-colors",
              showConsole
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
            )}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Console</span>
          </button>

          {/* Open in new tab */}
          <button
            onClick={() => {
              const url = engine === 'devbox' 
                ? (devboxMode === 'app' ? officialAppUrl : officialDevboxUrl) 
                : window.location.href;
              window.open(url, '_blank');
            }}
            title="Open in new tab"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-md transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 🚀 PREVIEW CONTAINER - 100% FULL WIDTH AND HEIGHT OF RIGHT PANE */}
      <div className="flex-1 min-h-0 w-full h-full relative flex items-center justify-center bg-[#000000] overflow-hidden">
        <div className={cn("transition-all duration-300 mx-auto h-full w-full flex flex-col justify-center", viewportWidthClass)}>
          {engine === 'devbox' ? (
            <div className="w-full h-full relative bg-black">
              {isVanilla ? (
                <iframe
                  key={refreshKey}
                  srcDoc={sandpackFiles['/index.html'] || '<!DOCTYPE html><html><body style="background:#050505;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h3>Vanilla Preview Ready</h3></body></html>'}
                  className="w-full h-full border-0 bg-[#050505]"
                  title="CodeDevBox Live VM (Vanilla Static)"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              ) : (
                <iframe
                  key={refreshKey}
                  src={devboxMode === 'ide' ? "https://codesandbox.io/p/devbox/opendev-io-dswngy?embed=1" : "https://dswngy-5173.csb.app/"}
                  className="w-full h-full border-0"
                  title="CodeDevBox Live VM"
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              )}
            </div>
          ) : (
            <SandpackProvider
              key={refreshKey}
              template={isVanilla ? "static" : "react-ts"}
              files={sandpackFiles}
              customSetup={{
                dependencies: isVanilla ? {} : deps,
                entry: entryFile,
              }}
              options={{
                autorun: true,
                recompileMode: 'immediate',
                externalResources: [
                  'https://cdn.tailwindcss.com',
                  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
                ],
              }}
              theme="dark"
              style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <SandpackLayout style={{ height: '100%', width: '100%', flex: 1, border: 'none', borderRadius: 0, background: '#050505', display: 'flex' }}>
                <div className="flex flex-col h-full w-full relative">
                  <SandpackPreviewComponent
                    style={{ height: '100%', width: '100%', flex: 1 }}
                    showNavigator={false}
                    showRefreshButton={false}
                    showOpenInCodeSandbox={false}
                  />
                  <SandpackTarsWatcher onFixError={onFixError} />
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
