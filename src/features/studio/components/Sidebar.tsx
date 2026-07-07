import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  OpendevLabsLogo, NewChatIcon, ChatsIcon, SettingsIcon, 
  GithubIcon, TrashIcon,
  DatabaseIcon, ZapIcon,
  PlusIcon
} from './icons/Icons';
import type { View, ChatSession } from '../types';

interface SidebarProps {
  onNavigate: (view: View) => void;
  recentChats: ChatSession[];
  onSelectChat: (chatId: string) => void;
  onDeleteSession: (chatId: string) => void;
  activeView: View;
  activeChatId: string | null;
  onToggle: () => void;
}

export function Sidebar({ onNavigate, recentChats, onSelectChat, onDeleteSession, activeView, activeChatId }: SidebarProps) {
  const navItems = [
    { id: 'all-chats' as View, label: 'Chats', icon: ChatsIcon },
    { id: 'settings' as View, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-[260px] bg-background flex flex-col h-full z-40">
      {/* 🏙️ LOGO & BRANDING */}
      <div className="p-4 flex items-center gap-2 mb-4">
        <div className="flex items-center px-1 gap-2">
          <div className="w-7 h-7 rounded bg-black text-white flex items-center justify-center font-bold text-lg shadow-sm">
            O
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">OpenStudio</span>
        </div>
        <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
          {/* Panel toggle icon or similar */}
          <div className="w-4 h-4 rounded border border-border flex items-center justify-center">
            <div className="w-2.5 h-[1px] bg-zinc-600" />
          </div>
        </button>
      </div>

      <div className="px-4 mb-8">
        <button
          onClick={() => onNavigate('new-chat')}
          className="w-full h-10 flex items-center justify-center gap-2 bg-zinc-900/50 border border-border text-foreground rounded-xl font-bold text-[12px] hover:bg-zinc-800 transition-all"
        >
          Start new chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {/* MAIN NAVIGATION */}
        <div className="space-y-0.5 mb-8">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full group flex items-center gap-3 px-3 py-2 transition-all duration-300 rounded-lg ${
                  isActive 
                    ? 'bg-zinc-900 text-foreground' 
                    : 'text-muted-foreground hover:text-zinc-300 hover:bg-zinc-900/30'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-[13px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* RECENT CHATS */}
        <div className="space-y-0.5">
          <div className="px-3 mb-2 text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Recents</div>
          <div className="space-y-0.5">
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                className="group relative"
              >
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 transition-all duration-300 rounded-lg text-left ${
                    activeChatId === chat.id 
                      ? 'bg-muted text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-zinc-300 hover:bg-zinc-900/30'
                  }`}
                >
                  <span className="text-[13px] font-medium truncate w-full">{chat.title || 'Untitled Session'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 mt-auto">
         <div className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-xl transition-colors cursor-pointer group">
           <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[11px] font-semibold text-zinc-300">
             OL
           </div>
           <div className="flex flex-col">
              <span className="text-[12px] font-bold text-foreground group-hover:text-foreground transition-colors">opendev-labs</span>
           </div>
         </div>
      </div>
    </aside>
  );
}
