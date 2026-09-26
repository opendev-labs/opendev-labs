import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatsIcon, SettingsIcon, TrashIcon, PlusIcon, StarIcon 
} from './icons/Icons';
import type { View, ChatSession } from '../types';
import { useAuth } from '../../../context/AuthContext';

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
  isOpen = false,
  onToggle 
}: SidebarProps) {
  const { user } = useAuth();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
  const [isRecentOpen, setIsRecentOpen] = useState(true);

  const favoriteChats = recentChats.filter(c => (c as any).isFavorite);

  if (!isOpen) {
    return (
      <aside className="w-16 bg-[#09090b] border-r border-zinc-800/80 flex flex-col items-center py-3 z-40 transition-all duration-300 shrink-0 select-none">
        {/* OFFICIAL BRAND LOGO */}
        <button 
          onClick={onToggle} 
          className="p-1 rounded-xl hover:bg-zinc-800/80 transition-colors mb-4 group cursor-pointer" 
          title="Expand Sidebar"
        >
          <img
            src="/logo-icon.webp"
            alt="OpenDev-Labs"
            className="h-8 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </button>

        {/* NEW CHAT ICON */}
        <button
          onClick={() => onNavigate('new-chat')}
          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all shadow-sm mb-4 cursor-pointer border border-zinc-700/60"
          title="New Chat"
        >
          <PlusIcon className="w-4 h-4 text-white" />
        </button>

        {/* NAV ICONS — active state: only icon color changes, NO background square */}
        <div className="flex flex-col gap-2 w-full px-2">
          <button
            onClick={() => onNavigate('all-chats')}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeView === 'all-chats' 
                ? 'text-white' 
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            title="History"
          >
            <ChatsIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeView === 'settings' 
                ? 'text-white' 
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* EXPAND ARROW — placed right below settings, NOT below avatar */}
          <button 
            onClick={onToggle} 
            className="p-2.5 flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer" 
            title="Expand Sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* BOTTOM: USER AVATAR (navigates to settings, no extra expand arrow here) */}
        <div className="mt-auto flex flex-col items-center">
          <button
            onClick={() => onNavigate('settings')}
            className="relative p-1 rounded-xl hover:bg-zinc-800/80 transition-colors group cursor-pointer"
            title={user?.name || 'User Profile'}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-8 h-8 rounded-lg object-cover border border-zinc-700 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-100 font-bold text-xs flex items-center justify-center border border-zinc-700 shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#09090b]" />
          </button>
        </div>
      </aside>
    );
  }


  return (
    <aside className="w-64 bg-[#09090b] border-r border-zinc-800/80 text-zinc-100 flex flex-col h-full z-40 transition-all duration-300 select-none shrink-0">
      {/* OFFICIAL BRAND LOGO & HEADER */}
      <div className="p-3.5 flex items-center justify-between border-b border-zinc-800/80">
        <Link to="/" className="flex items-center gap-2.5 min-w-0 transition-colors group">
          <img
            src="/logo-icon.webp"
            alt="OpenDev-Labs"
            className="h-8 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col truncate">
            <span className="font-extrabold text-xs tracking-wider uppercase text-zinc-100 leading-tight">
              OPENDEV-LABS
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Studio Copilot
            </span>
          </div>
        </Link>

        <button 
          onClick={onToggle}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors shrink-0 cursor-pointer"
          title="Collapse Sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* NEW CHAT BUTTON */}
      <div className="p-3">
        <button
          onClick={() => onNavigate('new-chat')}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/90 text-white px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:bg-zinc-700 cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* CHAT LIST & FAVORITES */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
        {/* FAVORITES */}
        <div>
          <button 
            onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
            className="flex items-center gap-1.5 w-full px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-left transition-colors cursor-pointer"
          >
            <span className="flex-1">Favorites</span>
            <svg className={`w-3 h-3 transition-transform ${isFavoritesOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isFavoritesOpen && (
            <div className="mt-1 space-y-1">
              {favoriteChats.length > 0 ? (
                favoriteChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left truncate cursor-pointer ${
                      activeChatId === chat.id 
                        ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/60' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                    }`}
                  >
                    <StarIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{chat.title || 'Untitled Session'}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-1.5 text-[11px] text-zinc-500 font-normal">No favorites yet</p>
              )}
            </div>
          )}
        </div>

        {/* RECENT CHATS */}
        <div>
          <button 
            onClick={() => setIsRecentOpen(!isRecentOpen)}
            className="flex items-center gap-1.5 w-full px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-left transition-colors cursor-pointer"
          >
            <span className="flex-1">Recent Chats</span>
            <svg className={`w-3 h-3 transition-transform ${isRecentOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isRecentOpen && (
            <div className="mt-1 space-y-1">
              {recentChats.length > 0 ? (
                recentChats.map(chat => {
                  const isSelected = activeChatId === chat.id;
                  return (
                    <div key={chat.id} className="group relative flex items-center">
                      <button
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all text-left truncate cursor-pointer pr-7 ${
                          isSelected 
                            ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/60' 
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                        }`}
                      >
                        <span className="truncate flex-1">{chat.title || 'Untitled Session'}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(chat.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition-opacity absolute right-1.5 cursor-pointer rounded-md hover:bg-zinc-800"
                        title="Delete Session"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="px-3 py-1.5 text-[11px] text-zinc-500 font-normal">No chats yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* USER PROFILE BOTTOM PANEL */}
      <div className="p-3 border-t border-zinc-800/80 mt-auto">
        <div 
          onClick={() => onNavigate('settings')}
          className="rounded-xl bg-zinc-900/90 border border-zinc-800/90 p-2.5 flex items-center justify-between group hover:border-zinc-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover border border-zinc-700 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-100 font-bold text-xs flex items-center justify-center border border-zinc-700 shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#09090b]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-100 truncate">
                {user?.name || 'Yash Shirish Ramteke'}
              </span>
              <span className="text-[10px] text-zinc-400 truncate">
                {user?.email || 'opendev-labs.office@gmail.com'}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('settings');
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
            title="Account Settings"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
