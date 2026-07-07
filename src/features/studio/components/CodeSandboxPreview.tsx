import React, { useState, useEffect } from 'react';
import type { FileNode } from '../types';
import { SpinnerIcon } from './icons/Icons';

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Browser chrome bar that sits above the preview.
 */
const BrowserBar: React.FC<{ 
    url: string; 
    onSync: () => void;
    isSyncing: boolean;
}> = ({ url, onSync, isSyncing }) => (
  <div className="h-14 bg-[#0A0A0A] border-b border-zinc-900 flex items-center px-6 gap-6 flex-shrink-0">
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5 mr-2">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
      </div>
    </div>

    <div className="flex-1 bg-[#050505] border border-zinc-900 rounded-xl h-9 flex items-center px-4 gap-3 group focus-within:border-zinc-700 transition-all">
      <svg className="w-3 h-3 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.44A20.01 20.01 0 0110 11.218m8.239-4.239A9.954 9.954 0 0121 12c0 1.221-.219 2.39-.621 3.475m-3.475 3.475A9.954 9.954 0 0112 21c-1.221 0-2.39-.219-3.475-.621m-3.475-3.475A9.954 9.954 0 013 12c0-1.221.219-2.39.621-3.475m3.475-3.475A9.954 9.954 0 0112 3c1.221 0 2.39.219 3.475.621m3.475 3.475A20.01 20.01 0 0114 11.218" /></svg>
      <span className="text-[11px] text-zinc-500 font-mono truncate">{url}</span>
    </div>

    <div className="flex items-center gap-4">
      <button 
        onClick={onSync}
        disabled={isSyncing}
        className={cn(
            "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2",
            isSyncing
                ? "bg-zinc-800 text-zinc-500 border-zinc-800 cursor-not-allowed" 
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30"
        )}
      >
        {isSyncing && <SpinnerIcon className="w-3 h-3 animate-spin" />}
        {isSyncing ? 'Syncing...' : 'Sync Preview'}
      </button>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
            Cloud Devbox
        </span>
      </div>
    </div>
  </div>
);

interface CodeSandboxPreviewProps {
  files: FileNode[];
}

export const CodeSandboxPreview: React.FC<CodeSandboxPreviewProps> = ({ files }) => {
    const [sandboxId, setSandboxId] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Auto-sync on mount if there are files
    useEffect(() => {
        if (files.length > 0 && !sandboxId && !isSyncing) {
            handleSync();
        }
    }, [files, sandboxId]); // Only run if sandboxId is missing

    const handleSync = async () => {
        if (files.length === 0) return;
        
        setIsSyncing(true);
        setError(null);
        
        try {
            const formattedFiles: Record<string, { content: string }> = {};
            files.forEach(f => {
                const path = f.path.startsWith('/') ? f.path.slice(1) : f.path;
                if (!path.endsWith('.keep')) {
                    formattedFiles[path] = { content: f.content || '' };
                }
            });

            // If package.json is missing, supply a basic one to trigger Node devbox
            if (!formattedFiles['package.json']) {
                formattedFiles['package.json'] = {
                    content: JSON.stringify({
                        name: "opendev-sandbox",
                        version: "1.0.0",
                        main: "index.js",
                        dependencies: {}
                    }, null, 2)
                };
            }

            const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ files: formattedFiles })
            });
            
            const data = await response.json();
            if (data.sandbox_id) {
                setSandboxId(data.sandbox_id);
                setError(null);
            } else {
                setError('Failed to create CodeSandbox');
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error creating sandbox');
        } finally {
            setIsSyncing(false);
        }
    };

    const fileCount = files.filter(f => !f.path.endsWith('.keep')).length;

    if (fileCount === 0) {
        return (
            <div className="flex flex-col h-full bg-[#080808]">
                <BrowserBar url="codesandbox.io/waiting" onSync={handleSync} isSyncing={isSyncing} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                            <SpinnerIcon className="w-5 h-5 text-zinc-700" />
                        </div>
                        <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.4em]">Awaiting Genesis Protocol</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden rounded-r-3xl border-l border-zinc-900 shadow-2xl">
            <BrowserBar 
                url={`codesandbox.io/embed/${sandboxId || 'syncing'}`} 
                onSync={handleSync} 
                isSyncing={isSyncing} 
            />
            
            {error && (
                <div className="p-4 text-red-400 bg-red-950 border-b border-red-900 text-sm font-mono">
                    ⚠️ {error}
                </div>
            )}
            
            <div className="flex-1 min-h-0 relative bg-[#151515]">
                {isSyncing && !sandboxId ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#080808]">
                        <div className="text-center space-y-4">
                            <SpinnerIcon className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">Deploying to Cloud Devbox...</p>
                        </div>
                    </div>
                ) : null}
                
                {sandboxId && (
                    <iframe
                        src={`https://codesandbox.io/embed/${sandboxId}?view=preview&theme=dark&hidenavigation=1`}
                        style={{ width: '100%', height: '100%', border: 0 }}
                        title="CodeSandbox Preview"
                        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    />
                )}
            </div>
        </div>
    );
};
