import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { 
  ChatsIcon, SettingsIcon, TrashIcon, PlusIcon, StarIcon 
} from './icons/Icons';
import {
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
  Star,
  Trash2,
  ExternalLink,
  Layers,
  ShieldCheck,
  Globe
} from 'lucide-react';
import type { View, ChatSession } from '../types';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { SettingsModal } from '../../components/modals/SettingsModal';
import { getAdminPanelUrl, getMainDomainUrl } from '../../lib/authSession';

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
  const { user, logout } = useAuth();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const favoriteChats = recentChats.filter(c => (c as any).isFavorite);

  if (!isOpen) {
    return (
      <aside className="w-16 bg-[#09090b] border-r border-zinc-800/80 flex flex-col items-center py-2.5 z-40 transition-all duration-300 shrink-0 select-none">
        
        {/* TOP: OFFICIAL OPENDEV-LABS BRAND LOGO (MATCHING DASHBOARD) */}
        <div className="flex items-center justify-center h-16 w-full border-b border-zinc-800/80 shrink-0 mb-3 px-2">
          <button 
            onClick={onToggle} 
            className="group flex items-center justify-center p-1 rounded-xl hover:bg-zinc-800/80 transition-all relative cursor-pointer" 
            title="Expand Sidebar"
          >
            <img
              src="/logo-icon.webp"
              alt="OpenDev-Labs"
              className="h-10 w-10 min-w-10 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('logo-opendevlabs.png')) {
                  target.src = '/logo-opendevlabs.png';
                } else if (!target.src.includes('opendev-labs.png')) {
                  target.src = '/opendev-labs.png';
                }
              }}
            />
          </button>
        </div>

        {/* NEW CHAT ICON */}
        <button
          onClick={() => onNavigate('new-chat')}
          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all shadow-sm mb-4 cursor-pointer border border-zinc-700/60"
          title="New Chat"
        >
          <PlusIcon className="w-4 h-4 text-white" />
        </button>

        {/* NAV ICONS */}
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
            onClick={() => onNavigate('templates')}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeView === 'templates' 
                ? 'text-[#00f2fe] bg-zinc-800/80 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            title="Templates & Showcase"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeView === 'settings' 
                ? 'text-white' 
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* EXPAND ARROW */}
          <button 
            onClick={onToggle} 
            className="p-2.5 flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer" 
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* BOTTOM: GOOGLE ACCOUNT PROFILE PIC WITH LOGOUT & SETTINGS (MATCHING DASHBOARD) */}
        <div className="mt-auto flex flex-col items-center relative pb-2 w-full px-2">
          {popoverOpen && createPortal(
            <div className="fixed inset-0 z-[9999] pointer-events-auto font-sans">
              <div
                className="fixed inset-0 bg-transparent"
                onClick={() => setPopoverOpen(false)}
              />
              <div className="fixed left-16 bottom-3 ml-3 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-[9999] animate-in fade-in slide-in-from-left-2 space-y-1 text-zinc-100 min-w-[220px]">
                <div className="px-2.5 py-2 border-b border-zinc-800 flex items-center gap-2.5">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="size-8 rounded-full object-cover shrink-0 border border-zinc-700 shadow-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-zinc-700">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-white truncate">
                      {user?.name || 'User Account'}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate font-medium">
                      {user?.email || 'user@opendev-labs.com'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPopoverOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Settings className="size-4 text-zinc-400" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    setPopoverOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="size-4 text-red-400" />
                  <span>Log out</span>
                </button>
              </div>
            </div>,
            document.body
          )}

          <button
            onClick={() => setPopoverOpen(!popoverOpen)}
            className="relative p-1 rounded-xl hover:bg-zinc-800/80 transition-colors group cursor-pointer"
            title={user?.name || 'Account & Settings'}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="size-8 rounded-lg object-cover border border-zinc-700 shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="size-8 rounded-lg bg-zinc-800 text-zinc-100 font-bold text-xs flex items-center justify-center border border-zinc-700 shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-[#09090b]" />
          </button>
        </div>

        {/* Account Settings Modal */}
        <SettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        />
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-[#09090b] border-r border-zinc-800/80 text-zinc-100 flex flex-col h-full z-40 transition-all duration-300 select-none shrink-0">
      
      {/* TOP LEFT: OFFICIAL BRAND LOGO & HEADER (MATCHING DASHBOARD PANEL) */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800/80 shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden group">
          <img
            src="/logo-icon.webp"
            alt="OpenDev-Labs"
            className="h-9 w-9 min-w-9 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('logo-opendevlabs.png')) {
                target.src = '/logo-opendevlabs.png';
              } else if (!target.src.includes('opendev-labs.png')) {
                target.src = '/opendev-labs.png';
              }
            }}
          />
          <div className="flex flex-col truncate">
            <span className="font-extrabold text-sm tracking-wider uppercase text-zinc-100">
              opendev-labs
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Engineering & Automation
            </span>
          </div>
        </Link>

        <button 
          onClick={onToggle}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors shrink-0 cursor-pointer"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>

      {/* NAV BUTTONS: NEW CHAT & TEMPLATES */}
      <div className="p-3 space-y-1.5">
        <button
          onClick={() => onNavigate('new-chat')}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/90 text-white px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:bg-zinc-700 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>

        <button
          onClick={() => onNavigate('templates')}
          className={`w-full flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm transition-all cursor-pointer ${
            activeView === 'templates'
              ? 'bg-zinc-800 text-[#00f2fe] border-[#00f2fe]/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
              : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#00f2fe]" />
          <span>Templates & Showcase</span>
        </button>

        {user?.role === 'developer' && (
          <a
            href={getAdminPanelUrl()}
            className="w-full flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-900/40 hover:border-red-500/50 shadow-sm transition-all cursor-pointer"
            title="OpenDev-Labs Central Admin Command Center"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Admin Control Center</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
          </a>
        )}
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
                    <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
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
                        <Trash2 className="w-3.5 h-3.5" />
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

      {/* BOTTOM: GOOGLE ACCOUNT PROFILE PIC WITH LOGOUT AND SETTINGS (MATCHING DASHBOARD) */}
      <div className="p-3 border-t border-zinc-800/80 mt-auto relative">
        
        {/* Drop-Up Popover / Flyout Menu */}
        {popoverOpen && createPortal(
          <div className="fixed inset-0 z-[9999] pointer-events-auto font-sans">
            <div
              className="fixed inset-0 bg-transparent"
              onClick={() => setPopoverOpen(false)}
            />
            <div className="fixed left-3 bottom-16 slide-in-from-bottom-2 w-[235px] p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-[9999] animate-in fade-in space-y-1 text-zinc-100">
              <div className="px-2.5 py-2 border-b border-zinc-800 flex items-center gap-2.5">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="size-8 rounded-full object-cover shrink-0 border border-zinc-700 shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="size-8 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-zinc-700">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-extrabold text-white truncate">
                    {user?.name || 'User Account'}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate font-medium">
                    {user?.email || 'user@opendev-labs.com'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPopoverOpen(false);
                  setSettingsOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-left cursor-pointer"
              >
                <Settings className="size-4 text-zinc-400" />
                <span>Settings</span>
              </button>

              {user?.role === 'developer' && (
                <a
                  href={getAdminPanelUrl()}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-left cursor-pointer"
                >
                  <ShieldCheck className="size-4 text-red-400" />
                  <span>Admin Control Center</span>
                  <ExternalLink className="size-3 ml-auto opacity-60" />
                </a>
              )}

              <a
                href={getMainDomainUrl()}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-left cursor-pointer"
              >
                <Globe className="size-4 text-zinc-400" />
                <span>Return to opendev-labs.com</span>
                <ExternalLink className="size-3 ml-auto opacity-60" />
              </a>

              <button
                onClick={() => {
                  setPopoverOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="size-4 text-red-400" />
                <span>Log out</span>
              </button>
            </div>
          </div>,
          document.body
        )}

        {/* User Card Content Matching AppSidebar */}
        <div 
          onClick={() => setPopoverOpen(!popoverOpen)}
          className="rounded-xl bg-zinc-900/90 border border-zinc-800/90 p-2.5 flex items-center justify-between group hover:border-zinc-700 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="size-8 rounded-lg object-cover border border-zinc-700 shadow-sm"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="size-8 rounded-lg bg-zinc-800 text-zinc-100 font-bold text-xs flex items-center justify-center border border-zinc-700 shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              {/* Online Status Dot */}
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-[#09090b]" />
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-zinc-100 truncate">
                {user?.name || 'Developer'}
              </span>
              <span className="text-[10px] text-zinc-400 truncate">
                {user?.email || 'opendev-labs.office@gmail.com'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSettingsOpen(true);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="size-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="size-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPopoverOpen(!popoverOpen);
              }}
              className={cn(
                "p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer",
                popoverOpen && "bg-zinc-800 text-white"
              )}
              title="Account Options"
            >
              <ChevronUp className="size-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Account Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </aside>
  );
}
