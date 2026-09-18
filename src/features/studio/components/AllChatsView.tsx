import React, { useState, useMemo } from 'react';
import type { ChatSession, View } from '../types';
import { PlusIcon, SearchIcon, TrashIcon, CodeIcon } from './icons/Icons';

function timeAgo(timestamp: number): string {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
}

interface AllChatsViewProps {
    sessions: ChatSession[];
    onSelectChat: (chatId: string) => void;
    onDeleteSession: (chatId: string) => void;
    onNavigate: (view: View) => void;
}

export function AllChatsView({ sessions, onSelectChat, onDeleteSession, onNavigate }: AllChatsViewProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSessions = useMemo(() => {
        return sessions
            .filter(session => session.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => b.lastUpdated - a.lastUpdated);
    }, [sessions, searchTerm]);

    return (
        <div className="h-full overflow-y-auto bg-[#050505] text-zinc-100 p-6 md:p-12 custom-scrollbar selection:bg-[#f02050]/30 selection:text-white">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* HEADER */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <img
                                src="/logo-icon.webp"
                                alt="OpenDev Labs"
                                className="h-8 w-8 object-contain"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Project <span className="text-[#f02050]">History</span>
                            </h1>
                        </div>
                        <p className="text-xs text-zinc-400 font-normal">
                            Manage and revisit all your generated web applications and builds.
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigate('new-chat')}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f02050] hover:bg-[#d01840] text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(240,32,80,0.4)] transition-all cursor-pointer shrink-0"
                    >
                        <PlusIcon className="h-4 w-4 text-white" />
                        <span>New Project</span>
                    </button>
                </header>

                {/* SEARCH BAR */}
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search projects by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#f02050] transition-colors"
                    />
                </div>

                {/* PROJECT LIST GRID */}
                <div className="space-y-3">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map(session => (
                            <div
                                key={session.id}
                                className="group relative bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 transition-all duration-300 flex items-center justify-between shadow-md"
                            >
                                <div className="flex items-center gap-4 truncate mr-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#f02050]/10 border border-[#f02050]/20 flex items-center justify-center text-[#f02050] shrink-0">
                                        <CodeIcon className="w-5 h-5" />
                                    </div>
                                    <div className="truncate">
                                        <h2 className="text-sm font-bold text-white truncate group-hover:text-[#f02050] transition-colors">
                                            {session.title || 'Untitled Session'}
                                        </h2>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] text-zinc-400 font-medium">
                                                Updated {timeAgo(session.lastUpdated)}
                                            </span>
                                            {session.fileTree && session.fileTree.length > 0 && (
                                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                                    {session.fileTree.length} files
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => onSelectChat(session.id)}
                                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700/60 transition-all cursor-pointer"
                                    >
                                        Open
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Are you sure you want to delete "${session.title}"?`)) {
                                                onDeleteSession(session.id);
                                            }
                                        }}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-xl border border-transparent hover:border-red-500/20 cursor-pointer"
                                        title="Delete project"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 px-6 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                            <CodeIcon className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">No Projects Found</h3>
                            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                                {searchTerm ? 'No projects match your search query.' : 'Click "+ New Project" to create your first web application build.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}