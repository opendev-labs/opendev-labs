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
  Menu,
  Sparkles,
  Bot,
  Headphones
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../context/ClientContext';
import { useTheme } from '../../context/ThemeContext';
import { useAISupport } from '../../context/AISupportContext';
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
  onToggleAgent?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommand, onOpenAddClient, onToggleMobileSidebar, onToggleAgent }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { clients, notifications, markNotificationRead } = useClients();
  const { theme, toggleTheme } = useTheme();
  const { toggleSupport } = useAISupport();

  const overdueClients = (clients || []).filter(c => c?.status === 'overdue');
  const activeRetainers = (clients || []).filter(c => c?.billingType === 'monthly_retainer' && c?.status !== 'offboarded');
  const totalMRR = activeRetainers.reduce((acc, c) => acc + (c?.monthlyFee || 0), 0);

  const welcomeItem = {
    id: `welcome-notif-header-${user?.id || 'guest'}`,
    title: '👋 Welcome to OpenDev-Labs Sovereign Portal!',
    message: `Signed in as ${user?.name || 'Google User'} (${user?.email || 'Gmail'}). Access live project tracking, payments, security settings, and direct AI support.`,
    date: new Date().toISOString().split('T')[0],
    read: false,
    type: 'system',
  };

  const combinedList = [welcomeItem, ...(notifications || [])];
  const displayNotifications = combinedList.filter((n, idx, self) =>
    n && idx === self.findIndex(t => t && (t.id === n.id || t.title === n.title))
  );

  const unreadCount = displayNotifications.filter(n => !n.read).length;
  const totalAlertsCount = unreadCount + overdueClients.length;

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 text-zinc-900 dark:text-zinc-100 transition-colors">
      
      {/* Left: Mobile Sidebar Trigger & Breadcrumb & Ticker Pills */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Sidebar Toggle Button (Desktop & Mobile) */}
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
          aria-label="Toggle Navigation Sidebar"
          title="Open / Close Sidebar"
        >
          <Menu className="size-5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:flex">
          <span>{user?.role === 'developer' ? 'Developer' : user?.role === 'client' ? 'Client' : 'User'}</span>
          <ChevronRight className="size-3 text-zinc-400 dark:text-zinc-600" />
          <span className="text-zinc-900 dark:text-white font-bold">
            {user?.role === 'developer' ? 'Admin Center' : user?.role === 'client' ? 'Portal' : 'Profile & Dashboard'}
          </span>
        </div>

        {/* Live Ticker Badges (Developer Only) */}
        {user?.role === 'developer' && (
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
        )}
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

        {/* Notifications Icon Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="size-4" />
              {totalAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse border-2 border-white dark:border-zinc-950">
                  {totalAlertsCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-0 shadow-xl">
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
              <span>Notifications & Updates</span>
              <Link to="/client/notifications" className="text-blue-600 dark:text-blue-400 text-[11px] font-bold hover:underline">
                View History →
              </Link>
            </div>
            <div className="p-3 space-y-2 max-h-72 overflow-y-auto text-xs">
              {/* Overdue alerts */}
              {overdueClients.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 space-y-1">
                  <span className="font-bold block">{c.name} Payment Overdue</span>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">₹{c.monthlyFee.toLocaleString()} due on {c.nextPaymentDue}</span>
                </div>
              ))}

              {/* Notification items */}
              {displayNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    !n.read
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60'
                      : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      {!n.read && <span className="size-2 rounded-full bg-blue-500 inline-block animate-pulse" />}
                      {n.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{n.date}</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              ))}

              {displayNotifications.length === 0 && overdueClients.length === 0 && (
                <p className="text-zinc-500 dark:text-zinc-400 text-center py-6">No notifications found.</p>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
