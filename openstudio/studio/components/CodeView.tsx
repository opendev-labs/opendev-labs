import React, { useState, useMemo, useEffect, useRef } from 'react';
import Editor, { loader, OnMount } from '@monaco-editor/react';
import type { FileNode, ChatSession, GenerationInfo, GenerationFile } from '../types';
import { FileIcon, FolderIcon, SpinnerIcon, FilePlusIcon, FolderPlusIcon, TrashIcon, PencilIcon, PanelLeftCloseIcon, SidebarIcon } from './icons/Icons';

// Configure monaco-editor loader to fetch assets from a CDN
loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs',
    },
});

declare global {
    interface Window {
        Babel: any;
    }
}

interface CodeViewProps {
    session: ChatSession;
    setActiveFile: (file: FileNode | null) => void;
    onFileContentChange: (path: string, content: string) => void;
    generationInfo: GenerationInfo | null;
    onAddFileOrFolder: (path: string, type: 'file' | 'folder') => void;
    onDeleteFileOrFolder: (path: string, isFile: boolean) => void;
    onRenameFileOrFolder: (oldPath: string, newPath: string, isFile: boolean) => void;
    activeTab: 'code' | 'preview';
    onFixError?: (errorPrompt: string) => void;
}

type TreeNode = {
    [key: string]: TreeNode | FileNode;
};

const buildFileTree = (files: FileNode[]): TreeNode => {
    const root: TreeNode = {};
    files.forEach(file => {
        const parts = file.path.split('/');
        let current: TreeNode = root;
        parts.forEach((part, i) => {
            if (i === parts.length - 1) {
                current[part] = file;
            } else {
                current[part] = current[part] || {};
                current = current[part] as TreeNode;
            }
        });
    });
    return root;
};


const FileTreeView: React.FC<{
    tree: TreeNode;
    onSelectFile: (file: FileNode) => void;
    activeFile: FileNode | null;
    generationStatusMap: Map<string, GenerationFile>;
    onAddFileOrFolder: (path: string, type: 'file' | 'folder') => void;
    onDeleteFileOrFolder: (path: string, isFile: boolean) => void;
    onRenameFileOrFolder: (oldPath: string, newPath: string, isFile: boolean) => void;
    level?: number;
    parentPath?: string;
}> = ({ tree, onSelectFile, activeFile, generationStatusMap, onAddFileOrFolder, onDeleteFileOrFolder, onRenameFileOrFolder, level = 0, parentPath = '' }) => {
    const [renaming, setRenaming] = useState<string | null>(null);
    const [creating, setCreating] = useState<'file' | 'folder' | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (renaming || creating) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [renaming, creating]);

    const handleRenameSubmit = (e: React.FormEvent, oldPath: string, isFile: boolean) => {
        e.preventDefault();
        const newName = ((e.currentTarget as HTMLFormElement).elements.namedItem('name') as HTMLInputElement).value;
        const oldName = oldPath.split('/').pop() || '';
        if (newName && newName !== oldName) {
            const newPath = [...oldPath.split('/').slice(0, -1), newName].join('/');
            onRenameFileOrFolder(oldPath, newPath, isFile);
        }
        setRenaming(null);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = ((e.currentTarget as HTMLFormElement).elements.namedItem('name') as HTMLInputElement).value;
        if (name && creating) {
            const newPath = parentPath ? `${parentPath}/${name}` : name;
            onAddFileOrFolder(newPath, creating);
        }
        setCreating(null);
    };

    const EntryInput: React.FC<{
        defaultValue?: string;
        onSubmit: (e: React.FormEvent) => void;
        onBlur: () => void;
        icon: React.ReactNode;
    }> = ({ defaultValue, onSubmit, onBlur, icon }) => (
        <form onSubmit={onSubmit} className="w-full text-left text-sm flex items-center gap-2 px-2 py-1 rounded-md bg-white/10" style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}>
            {icon}
            <input
                ref={inputRef}
                type="text"
                name="name"
                defaultValue={defaultValue}
                onBlur={onBlur}
                className="bg-transparent text-foreground w-full focus:outline-none"
                autoComplete="off"
            />
        </form>
    );

    return (
        <ul className="space-y-0.5">
            {Object.entries(tree)
                .filter(([name]) => name !== '.keep')
                .sort(([aName, aNode], [bName, bNode]) => {
                    const aIsFile = !!(aNode as FileNode).path;
                    const bIsFile = !!(bNode as FileNode).path;
                    if (aIsFile === bIsFile) return aName.localeCompare(bName);
                    return aIsFile ? 1 : -1;
                })
                .map(([name, node]) => {
                    const isFile = !!(node as FileNode).path;
                    const currentPath = parentPath ? `${parentPath}/${name}` : name;

                    if (renaming === currentPath) {
                        return (
                            <li key={currentPath}>
                                <EntryInput
                                    defaultValue={name}
                                    onSubmit={(e) => handleRenameSubmit(e, currentPath, isFile)}
                                    onBlur={() => setRenaming(null)}
                                    icon={isFile ? <FileIcon className="h-4 w-4 flex-shrink-0" /> : <FolderIcon className="h-4 w-4 flex-shrink-0" />}
                                />
                            </li>
                        );
                    }

                    return (
                        <li key={currentPath}>
                            <div className="group relative">
                                <button
                                    onClick={() => isFile && onSelectFile(node as FileNode)}
                                    style={{ paddingLeft: `${level * 1.25}rem` }}
                                    className={`w-full text-left text-sm flex items-center justify-between gap-2 px-2 py-1 rounded-md ${activeFile?.path === currentPath ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        {isFile ? <FileIcon className="h-4 w-4 flex-shrink-0" /> : <FolderIcon className="h-4 w-4 flex-shrink-0" />}
                                        <span className="truncate">{name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {generationStatusMap.get(currentPath)?.status === 'generating' && (
                                            <svg className="w-3.5 h-3.5 animate-spin text-[#00f2fe]" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        )}
                                        {generationStatusMap.get(currentPath)?.status === 'complete' && (
                                            <span className="text-[9px] font-mono text-emerald-400 font-bold">✓</span>
                                        )}
                                    </div>
                                </button>
                                <div className="absolute top-1/2 -translate-y-1/2 right-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-md">
                                    <button onClick={() => setRenaming(currentPath)} className="p-1 text-muted-foreground hover:text-foreground" title="Rename"><PencilIcon className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => onDeleteFileOrFolder(currentPath, isFile)} className="p-1 text-muted-foreground hover:text-red-500" title="Delete"><TrashIcon className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            {!isFile && (
                                <FileTreeView
                                    tree={node as TreeNode}
                                    onSelectFile={onSelectFile}
                                    activeFile={activeFile}
                                    generationStatusMap={generationStatusMap}
                                    onAddFileOrFolder={onAddFileOrFolder}
                                    onDeleteFileOrFolder={onDeleteFileOrFolder}
                                    onRenameFileOrFolder={onRenameFileOrFolder}
                                    level={level + 1}
                                    parentPath={currentPath}
                                />
                            )}
                        </li>
                    );
                })}
            {creating && (
                <li>
                    <EntryInput
                        onSubmit={handleCreateSubmit}
                        onBlur={() => setCreating(null)}
                        icon={creating === 'file' ? <FileIcon className="h-4 w-4 flex-shrink-0" /> : <FolderIcon className="h-4 w-4 flex-shrink-0" />}
                    />
                </li>
            )}
        </ul>
    );
};

// Client-side & Cloud DevBox VM powered live preview engine
import { LiveDevBoxPreview } from './LiveDevBoxPreview';
const PreviewPane: React.FC<{ files: FileNode[]; onFixError?: (prompt: string) => void }> = ({ files, onFixError }) => {
    return <LiveDevBoxPreview files={files} onFixError={onFixError} />;
};

export function CodeView({ session, setActiveFile, onFileContentChange, generationInfo, onAddFileOrFolder, onDeleteFileOrFolder, onRenameFileOrFolder, activeTab, onFixError }: CodeViewProps) {
    const { fileTree, activeFile } = session;
    const [rootCreating, setRootCreating] = useState<'file' | 'folder' | null>(null);
    const [isFileTreeVisible, setIsFileTreeVisible] = useState(true);
    const [isTerminalOpen, setIsTerminalOpen] = useState(true);
    const [activeTerminalTab, setActiveTerminalTab] = useState<'terminal' | 'problems' | 'output' | 'debug' | 'ports'>('terminal');
    const [terminalInput, setTerminalInput] = useState('');
    const [problems, setProblems] = useState<{ message: string; line: number; severity: string }[]>([]);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([
        'VITE v6.3.5  ready in 149 ms',
        '➜  Local:   http://localhost:5173/',
        '➜  Network: use --host to expose',
        '➜  press h + enter to show help',
        '✔  Agent Engine: TARS Live Terminal & Console Inspector Connected.',
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const monacoEditorRef = useRef<any>(null);

    useEffect(() => {
        if (monacoEditorRef.current && generationInfo?.status === 'generating') {
            try {
                const model = monacoEditorRef.current.getModel();
                if (model) {
                    const lineCount = model.getLineCount();
                    monacoEditorRef.current.revealLine(lineCount);
                }
            } catch (e) {
                // Ignore transient scroll errors
            }
        }
    }, [activeFile?.content, generationInfo?.status]);

    useEffect(() => {
        if (generationInfo && generationInfo.files.length > 0) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] Materialized ${generationInfo.files.length} file(s): ${generationInfo.files.map(f => f.path).join(', ')}`;
            setTerminalLogs(prev => [...prev, logEntry]);
        }
    }, [generationInfo]);

    useEffect(() => {
        if (rootCreating) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [rootCreating]);

    const handleTerminalCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!terminalInput.trim()) return;
        const cmd = terminalInput.trim();
        const timestamp = new Date().toLocaleTimeString();
        let response = `bash: ${cmd}: command executed successfully in Devbox VM context.`;
        if (cmd.startsWith('npm') || cmd.startsWith('pnpm') || cmd.startsWith('bun')) {
            response = `✔ Installed package dependencies in CodeDevBox container.`;
        } else if (cmd === 'clear') {
            setTerminalLogs([]);
            setTerminalInput('');
            return;
        }

        if (cmd.toLowerCase().includes('fix') || cmd.toLowerCase().includes('tars') || cmd.toLowerCase().includes('build') || cmd.toLowerCase().includes('error')) {
            response = `⚡ TARS Agent dispatched to inspect workspace, terminal logs, and resolve issues...`;
            if (onFixError) {
                onFixError(`TARS Terminal Command: "${cmd}". Please inspect all workspace files and terminal/console diagnostics, repair any syntax, package, or build errors, and ensure the build succeeds.`);
            }
        }

        setTerminalLogs(prev => [...prev, `dev@opendev-studio:~$ ${cmd}`, response]);
        setTerminalInput('');
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        monacoEditorRef.current = editor;
        (window as any).monaco = monaco;

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            noEmit: true,
            jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
            reactNamespace: "React",
            typeRoots: ["file:///node_modules/@types"]
        });

        // Watch for editor problems / diagnostics in real time
        editor.onDidChangeModelDecorations(() => {
            const model = editor.getModel();
            if (model) {
                try {
                    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
                    const errorList = markers.map((m: any) => ({
                        message: m.message,
                        line: m.startLineNumber,
                        severity: m.severity === 8 ? 'Error' : 'Warning'
                    }));
                    setProblems(errorList);
                } catch (e) {
                    // ignore
                }
            }
        });

        const addExtraLibs = async () => {
            try {
                const reactVersion = "18";
                const [reactTypes, reactGlobalTypes, reactDomTypes] = await Promise.all([
                    fetch(`https://unpkg.com/@types/react@${reactVersion}/index.d.ts`).then(res => res.text()),
                    fetch(`https://unpkg.com/@types/react@${reactVersion}/global.d.ts`).then(res => res.text()),
                    fetch(`https://unpkg.com/@types/react-dom@${reactVersion}/index.d.ts`).then(res => res.text())
                ]);

                monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, `file:///node_modules/@types/react/index.d.ts`);
                monaco.languages.typescript.typescriptDefaults.addExtraLib(reactGlobalTypes, `file:///node_modules/@types/react/global.d.ts`);
                monaco.languages.typescript.typescriptDefaults.addExtraLib(reactDomTypes, `file:///node_modules/@types/react-dom/index.d.ts`);
            } catch (error) {
                console.error("Could not fetch React type definitions for Monaco:", error);
            }
        };

        addExtraLibs();
    };

    const fileTreeData = useMemo(() => buildFileTree(fileTree), [fileTree]);

    const generationStatusMap = useMemo(() => {
        const map = new Map<string, GenerationFile>();
        if (generationInfo) {
            generationInfo.files.forEach(f => map.set(f.path, f));
        }
        return map;
    }, [generationInfo]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = ((e.currentTarget as HTMLFormElement).elements.namedItem('name') as HTMLInputElement).value;
        if (name && rootCreating) {
            onAddFileOrFolder(name, rootCreating);
        }
        setRootCreating(null);
    };

    const editorLoadingState = (
        <div className="flex items-center justify-center h-full text-zinc-500 gap-2 text-xs font-mono">
            <SpinnerIcon className="w-4 h-4 animate-spin text-[#f02050]" />
            <span>Loading Monaco Editor Engine...</span>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#050505] overflow-hidden text-zinc-200">
            <div className="flex-1 flex overflow-hidden">
                {/* 📂 COMPACT MINIMAL FILE EXPLORER PANEL */}
                {activeTab === 'code' && isFileTreeVisible && (
                    <aside className="w-[200px] bg-[#050505] p-2.5 overflow-y-auto border-r border-zinc-900/80 shrink-0 select-none">
                        <header className="flex items-center justify-between pb-2 border-b border-zinc-900 mb-2">
                            <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Workspace</h3>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setRootCreating('folder')} className="p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors rounded" title="New Folder">
                                    <FolderPlusIcon className="w-3 h-3" />
                                </button>
                                <button onClick={() => setRootCreating('file')} className="p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors rounded" title="New File">
                                    <FilePlusIcon className="w-3 h-3" />
                                </button>
                            </div>
                        </header>

                        {rootCreating && (
                            <form onSubmit={handleCreateSubmit} className="w-full text-left text-xs flex items-center gap-1.5 px-2 py-1 bg-zinc-900/80 border border-zinc-800 rounded mb-2">
                                {rootCreating === 'file' ? <FileIcon className="h-3 w-3 text-zinc-500" /> : <FolderIcon className="h-3 w-3 text-zinc-500" />}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    name="name"
                                    onBlur={() => setRootCreating(null)}
                                    className="bg-transparent text-white text-[11px] w-full focus:outline-none placeholder-zinc-600 font-mono"
                                    autoComplete="off"
                                    placeholder="filename..."
                                />
                            </form>
                        )}

                        {Object.keys(fileTreeData).length > 0 || rootCreating ? (
                            <FileTreeView
                                tree={fileTreeData}
                                onSelectFile={setActiveFile}
                                activeFile={activeFile}
                                generationStatusMap={generationStatusMap}
                                onAddFileOrFolder={onAddFileOrFolder}
                                onDeleteFileOrFolder={onDeleteFileOrFolder}
                                onRenameFileOrFolder={onRenameFileOrFolder}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center mt-12 opacity-40">
                               <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mb-2" />
                               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Empty</p>
                            </div>
                        )}
                    </aside>
                )}

                {/* MAIN CANVAS: MINIMAL MONACO EDITOR + INTEGRATED TERMINAL */}
                <main className="flex-1 flex flex-col overflow-hidden relative bg-[#050505]">
                    {activeTab === 'code' && !isFileTreeVisible && (
                        <button
                            onClick={() => setIsFileTreeVisible(true)}
                            className="absolute top-2 left-2 z-10 p-1 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-colors rounded backdrop-blur-md text-zinc-400"
                            title="Show Explorer"
                        >
                            <SidebarIcon className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {activeTab === 'code' ? (
                        activeFile ? (
                            <div className="flex-1 flex flex-col min-h-0 relative">
                                {/* EDITOR TOP TAB BAR */}
                                <div className="flex-shrink-0 bg-[#09090b] px-3 h-8 flex items-center justify-between border-b border-zinc-900">
                                    <div className="flex items-center gap-2">
                                        <FileIcon className="h-3 w-3 text-emerald-400" />
                                        <span className="text-[11px] font-mono font-medium text-white">{activeFile.path}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {generationInfo?.status === 'generating' ? (
                                            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[10px] font-mono font-bold text-[#00f2fe]">
                                                <svg className="w-3 h-3 animate-spin text-[#00f2fe]" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                <span>GENERATING...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-mono text-zinc-400">SAVED</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all ${
                                                isTerminalOpen ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
                                            }`}
                                        >
                                            TERMINAL
                                        </button>
                                    </div>
                                </div>

                                {/* MONACO EDITOR CONTAINER */}
                                <div className="flex-1 relative overflow-hidden">
                                    <Editor
                                        path={activeFile.path}
                                        value={activeFile.content}
                                        onChange={(value) => onFileContentChange(activeFile.path, value || '')}
                                        theme="vs-dark"
                                        loading={editorLoadingState}
                                        onMount={handleEditorDidMount}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 12,
                                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                            wordWrap: 'on',
                                            lineNumbers: 'on',
                                            glyphMargin: false,
                                            folding: true,
                                            lineDecorationsWidth: 6,
                                            lineNumbersMinChars: 3,
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            tabSize: 2,
                                            insertSpaces: true,
                                            padding: { top: 12, bottom: 12 },
                                            backgroundColor: '#050505'
                                        }}
                                    />
                                </div>

                                {/* 🖥️ INTEGRATED DEVBOX TERMINAL PANEL (VS CODE STYLE MATCHING SCREENSHOT) */}
                                {isTerminalOpen && (
                                    <div className="h-44 bg-[#09090b] border-t border-zinc-800 flex flex-col font-mono text-[11px] shrink-0">
                                        {/* TERMINAL HEADER TABS */}
                                        <div className="h-7 bg-[#050505] border-b border-zinc-800/80 px-3 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {(['terminal', 'problems', 'output', 'debug', 'ports'] as const).map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setActiveTerminalTab(tab)}
                                                        className={`uppercase text-[10px] font-bold tracking-wider transition-all border-b-2 py-1 ${
                                                            activeTerminalTab === tab
                                                                ? 'text-white border-[#f02050]'
                                                                : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                                        }`}
                                                    >
                                                        {tab === 'ports' ? 'PORTS (5173)' : tab === 'problems' ? `PROBLEMS (${problems.length})` : tab}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {onFixError && (
                                                    <button
                                                        onClick={() => onFixError(`TARS Terminal & Console Diagnostics: Run a comprehensive check of all workspace files, inspect console/terminal errors, and repair the build.`)}
                                                        className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] hover:bg-[#00f2fe]/20 text-[10px] font-mono font-bold transition-all shadow-[0_0_8px_rgba(0,242,254,0.15)]"
                                                        title="Ask TARS to analyze terminal logs and fix build"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
                                                        ⚡ Fix with TARS
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setTerminalLogs([])}
                                                    className="text-[10px] text-zinc-500 hover:text-white"
                                                    title="Clear terminal"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    onClick={() => setIsTerminalOpen(false)}
                                                    className="text-[10px] text-zinc-500 hover:text-white"
                                                    title="Close terminal"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>

                                        {/* TERMINAL BODY LOGS & PROMPT */}
                                        <div className="flex-1 p-3 overflow-y-auto space-y-1 bg-[#09090b] text-zinc-300 custom-scrollbar">
                                            {activeTerminalTab === 'terminal' && (
                                                <>
                                                    {terminalLogs.map((log, idx) => (
                                                        <div key={idx} className={`leading-tight ${log.includes('VITE') || log.includes('Local:') ? 'text-emerald-400 font-bold' : log.includes('Agent') || log.includes('TARS') ? 'text-[#00f2fe]' : 'text-zinc-300'}`}>
                                                            {log}
                                                        </div>
                                                    ))}
                                                    <form onSubmit={handleTerminalCommand} className="flex items-center gap-2 pt-1">
                                                        <span className="text-emerald-400 font-bold">dev@opendev-studio:~$</span>
                                                        <input
                                                            type="text"
                                                            value={terminalInput}
                                                            onChange={(e) => setTerminalInput(e.target.value)}
                                                            className="flex-1 bg-transparent text-white focus:outline-none font-mono text-[11px]"
                                                            placeholder="type terminal command or 'tars fix'..."
                                                        />
                                                    </form>
                                                    <div ref={terminalEndRef} />
                                                </>
                                            )}

                                            {activeTerminalTab === 'problems' && (
                                                <div className="space-y-1.5 py-1">
                                                    {problems.length === 0 ? (
                                                        <div className="text-zinc-500 py-1 flex items-center gap-2">
                                                            <span className="text-emerald-400">✔</span>
                                                            <span>No problems detected in workspace code. TARS inspector active.</span>
                                                        </div>
                                                    ) : (
                                                        problems.map((p, idx) => (
                                                            <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded bg-red-950/20 border border-red-900/30 text-xs">
                                                                <div className="flex items-center gap-2 truncate text-red-300">
                                                                    <span className="font-bold text-red-400">[{p.severity} L{p.line}]:</span>
                                                                    <span className="truncate font-mono text-[11px]">{p.message}</span>
                                                                </div>
                                                                {onFixError && (
                                                                    <button
                                                                        onClick={() => onFixError(`Fix ${p.severity} on line ${p.line} in ${activeFile?.path || 'workspace'}: "${p.message}". Inspect and correct the code.`)}
                                                                        className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 hover:text-white hover:bg-red-500 text-[10px] font-mono font-bold shrink-0 transition-colors flex items-center gap-1"
                                                                    >
                                                                        ⚡ Fix with TARS
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}

                                            {activeTerminalTab === 'output' && (
                                                <div className="text-zinc-400 py-1">[Agent Pipeline] Output stream connected to local Vite server & TARS VM monitor.</div>
                                            )}

                                            {activeTerminalTab === 'debug' && (
                                                <div className="text-zinc-500 py-1">Debugger ready. Listening on port 9229.</div>
                                            )}

                                            {activeTerminalTab === 'ports' && (
                                                <div className="space-y-1 py-1">
                                                    <div className="flex items-center justify-between text-zinc-300">
                                                        <span>5173 (Vite App)</span>
                                                        <span className="text-emerald-400 font-bold">FORWARDED → Localhost</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                <div className="w-10 h-10 bg-zinc-900/40 border border-zinc-800 flex items-center justify-center mb-3 rounded-xl">
                                    <FileIcon className="h-4 w-4 text-zinc-500" />
                                </div>
                                <p className="text-xs font-bold text-zinc-400">Select a file from the workspace</p>
                                <p className="text-[11px] text-zinc-600 mt-1">TARS AI will materialize code on prompt</p>
                            </div>
                        )
                    ) : (
                        <div className="flex-1 h-full w-full bg-black min-w-0 overflow-hidden">
                            <PreviewPane files={fileTree} onFixError={onFixError} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}