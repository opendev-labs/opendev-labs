import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatsIcon, SettingsIcon, GithubIcon, TrashIcon, PlusIcon, StarIcon, BrainCircuitIcon 
} from './icons/Icons';
import type { View, ChatSession } from '../types';

interface SidebarProps {
  onNavigate: (view: View) => void;
  recentChats: ChatSession[];
  onSelectChat: (chatId: string) => void;
  onDeleteSession: (chatId: string) => void;
  activeView: View;
  activeChatId: string | null;
  isOpen?: boolean;
  onToggle: () => void;
}

export function Sidebar({ 
  onNavigate, 
  recentChats, 
  onSelectChat, 
  onDeleteSession, 
  activeView, 
  activeChatId,
  isOpen = true,
  onToggle 
}: SidebarProps) {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
  const [isRecentOpen, setIsRecentOpen] = useState(true);

  const favoriteChats = recentChats.filter(c => (c as any).isFavorite);

  if (!isOpen) {
    return (
      <aside className="w-14 bg-[#09090b] border-r border-zinc-800/80 flex flex-col items-center py-3 z-40 transition-all duration-300 shrink-0">
        {/* LOGO ICON */}
        <button onClick={onToggle} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg mb-4" title="Expand Sidebar">
          <div className="w-7 h-7 rounded-md bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe] font-bold text-xs">
            O
          </div>
        </button>

        {/* NEW CHAT ICON */}
        <button
          onClick={() => onNavigate('new-chat')}
          className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all shadow-md mb-4"
          title="New Chat"
        >
          <PlusIcon className="w-4 h-4 text-black" />
        </button>

        {/* NAV ICONS */}
        <div className="flex flex-col gap-2 w-full px-2">
          <button
            onClick={() => onNavigate('all-chats')}
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${activeView === 'all-chats' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            title="History"
          >
            <ChatsIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${activeView === 'settings' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-auto">
          <button onClick={onToggle} className="p-2 text-zinc-500 hover:text-white transition-colors" title="Expand Sidebar">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-[#09090b] border-r border-zinc-800/80 flex flex-col h-full z-40 transition-all duration-300 select-none shrink-0">
      {/* WORKSPACE / TEAM HEADER */}
      <div className="p-2 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-zinc-800/60 cursor-pointer flex-1 min-w-0 transition-colors">
          <span className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs shrink-0">
            O
          </span>
          <span className="text-xs font-semibold text-zinc-100 truncate">OpenDev Team</span>
          <svg className="w-3 h-3 text-zinc-500 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <button 
          onClick={onToggle}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-md transition-colors shrink-0"
          title="Collapse Sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* NEW CHAT BUTTON */}
      <div className="p-2">
        <button
          onClick={() => onNavigate('new-chat')}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-100 shadow-sm transition-all hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5 text-zinc-100" />
          <span>New Chat</span>
        </button>
      </div>

      {/* CHAT LIST & FAVORITES */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
        {/* FAVORITES */}
        <div>
          <button 
            onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
            className="flex items-center gap-1.5 w-full px-2 py-1 text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider text-left transition-colors"
          >
            <span className="flex-1">Favorites</span>
            <svg className={`w-3 h-3 transition-transform ${isFavoritesOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isFavoritesOpen && (
            <div className="mt-1 space-y-0.5">
              {favoriteChats.length > 0 ? (
                favoriteChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-all text-left truncate cursor-pointer ${
                      activeChatId === chat.id ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <StarIcon className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{chat.title || 'Untitled Session'}</span>
                  </button>
                ))
              ) : (
                <p className="px-2.5 py-1 text-[11px] text-zinc-500 font-normal">No favorites yet</p>
              )}
            </div>
          )}
        </div>

        {/* RECENT CHATS */}
        <div>
          <button 
            onClick={() => setIsRecentOpen(!isRecentOpen)}
            className="flex items-center gap-1.5 w-full px-2 py-1 text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider text-left transition-colors"
          >
            <span className="flex-1">Recent Chats</span>
            <svg className={`w-3 h-3 transition-transform ${isRecentOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isRecentOpen && (
            <div className="mt-1 space-y-0.5">
              {recentChats.length > 0 ? (
                recentChats.map(chat => {
                  const isSelected = activeChatId === chat.id;
                  return (
                    <div key={chat.id} className="group relative flex items-center">
                      <button
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-all text-left truncate cursor-pointer ${
                          isSelected ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                        }`}
                      >
                        <span className="truncate flex-1">{chat.title || 'Untitled Session'}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(chat.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition-opacity absolute right-1"
                        title="Delete Session"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="px-2.5 py-1 text-[11px] text-zinc-500 font-normal">No chats yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER: API KEY & SETTINGS */}
      <div className="p-2 border-t border-zinc-800/80">
        <button
          onClick={() => onNavigate('settings')}
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer"
        >
          <BrainCircuitIcon className="w-4 h-4 text-[#00f2fe]" />
          <span className="flex-1 text-left font-medium">API Keys & Models</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" title="Configured" />
        </button>
      </div>
    </aside>
  );
}


