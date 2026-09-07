import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Globe,
  Plus,
  Shield,
  User,
  LogOut,
  ChevronRight,
  ExternalLink,
  Search,
  Command,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../context/ClientContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface HeaderProps {
  onOpenCommand: () => void;
  onOpenAddClient: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommand, onOpenAddClient, onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { clients, notifications } = useClients();
  const { theme, toggleTheme } = useTheme();

  const overdueClients = clients.filter(c => c.status === 'overdue');
  const activeRetainers = clients.filter(c => c.billingType === 'monthly_retainer' && c.status !== 'offboarded');
  const totalMRR = activeRetainers.reduce((acc, c) => acc + c.monthlyFee, 0);

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 text-zinc-900 dark:text-zinc-100 transition-colors">
      
      {/* Left: Mobile Sidebar Trigger & Breadcrumb & Ticker Pills */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle Mobile Navigation"
        >
          <Menu className="size-5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:flex">
          <span>{user?.role === 'developer' ? 'Developer' : 'Client'}</span>
          <ChevronRight className="size-3 text-zinc-400 dark:text-zinc-600" />
          <span className="text-zinc-900 dark:text-white font-bold">Dashboard</span>
        </div>

        {/* Live Ticker Badges */}
        <div className="hidden md:flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <span className="text-zinc-500 dark:text-zinc-400 font-semibold">MRR</span>
            <span className="text-zinc-900 dark:text-white font-bold">₹{totalMRR.toLocaleString()}</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">▲ +15%</span>
          </div>

          <div className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <span className="text-zinc-500 dark:text-zinc-400 font-semibold">RETAINERS</span>
            <span className="text-zinc-900 dark:text-white font-bold">{activeRetainers.length} Active</span>
          </div>

          {overdueClients.length > 0 && (
            <div className="px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-[11px] font-mono text-red-700 dark:text-red-300 flex items-center gap-1.5">
              <span className="font-bold">OVERDUE ({overdueClients.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Search Command Trigger */}
        <button
          onClick={onOpenCommand}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <Search className="size-3.5" />
          <span className="text-xs font-medium">Search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 text-[9px] font-mono text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">⌘K</kbd>
        </button>

        {/* Website Link Pill Button */}
        <a
          href="/"
          className="h-8 px-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
        >
          <Globe className="size-3.5" /> Website
        </a>

        {/* Quick Add Client (If Dev) */}
        {user?.role === 'developer' && (
          <button
            onClick={onOpenAddClient}
            className="h-8 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors hidden sm:inline-flex"
          >
            <Plus className="size-3.5 text-zinc-600 dark:text-zinc-400" /> New Client
          </button>
        )}

        {/* Notifications Icon Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors relative">
              <Bell className="size-4" />
              {overdueClients.length > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-0 shadow-xl">
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
              <span>Notifications & Reminders</span>
              <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-[10px]">
                {overdueClients.length} Action Required
              </span>
            </div>
            <div className="p-3 space-y-2 max-h-60 overflow-y-auto text-xs">
              {overdueClients.map(c => (
                <div key={c.id} className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200">
                  <span className="font-bold block">{c.name} Payment Overdue</span>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">₹{c.monthlyFee.toLocaleString()} due on {c.nextPaymentDue}</span>
                </div>
              ))}
              {overdueClients.length === 0 && (
                <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">No pending alerts.</p>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark Mode Toggle Switch - Top Right End */}
        <button
          onClick={toggleTheme}
          className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="size-4 text-zinc-700" /> : <Sun className="size-4 text-amber-400" />}
        </button>
      </div>
    </header>
  );
};
