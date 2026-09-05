import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BellRing,
  ReceiptText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Globe,
  PlusCircle,
  HelpCircle,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../context/ClientContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAddClient: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'destructive' | 'default';
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenAddClient,
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { clients } = useClients();
  const { theme, toggleTheme } = useTheme();

  const overdueCount = clients.filter(c => c.status === 'overdue').length;
  const isDev = user?.role === 'developer';

  const devNavItems: NavItem[] = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Clients CRM', path: '/dashboard/clients', icon: Users, badge: clients.length },
    { title: 'Payment Reminders', path: '/dashboard/reminders', icon: BellRing, badge: overdueCount > 0 ? `${overdueCount}` : undefined, badgeVariant: 'destructive' },
    { title: 'Invoices & Ledger', path: '/dashboard/invoices', icon: ReceiptText },
    { title: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const clientNavItems: NavItem[] = [
    { title: 'Dashboard', path: '/client/portal', icon: LayoutDashboard },
    { title: 'Invoices', path: '/client/invoices', icon: ReceiptText },
    { title: 'Support & Tickets', path: '/client/support', icon: HelpCircle },
  ];

  const navItems = isDev ? devNavItems : clientNavItems;

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-all duration-300 z-30 select-none shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Top Logo Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <img src="/logo-icon.webp" alt="OpenDev-Labs" className="h-7 w-auto object-contain shrink-0" onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} />
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-xs tracking-wider uppercase text-zinc-900 dark:text-white leading-tight">
                OPENDEV-LABS
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                {isDev ? 'Developer Portal' : 'Client Gateway'}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        
        {/* Menu Section */}
        <div>
          {!collapsed && (
            <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              MENU
            </div>
          )}

          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative group',
                    isActive
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                  )}
                >
                  <Icon className={cn('size-4 shrink-0', isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white')} />
                  {!collapsed && <span className="truncate flex-1">{item.title}</span>}

                  {!collapsed && item.badge !== undefined && (
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-bold',
                      item.badgeVariant === 'destructive'
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                        : isActive ? 'bg-zinc-800 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick External Links */}
        {!collapsed && (
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1">
            <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              PORTFOLIO & SITE
            </div>

            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all"
            >
              <Home className="size-4 shrink-0 text-zinc-500" />
              <span>Agency Homepage</span>
            </Link>

            <a
              href="/iamyashramteke/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all"
            >
              <Globe className="size-4 shrink-0 text-zinc-900 dark:text-white" />
              <span className="truncate flex items-center justify-between flex-1">
                Yash Portfolio
                <ExternalLink className="size-3 text-zinc-400" />
              </span>
            </a>
          </div>
        )}
      </div>

      {/* Bottom User Card */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0) : 'Y'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-zinc-900 truncate">{user?.name || 'Yash Ramteke'}</span>
                <span className="text-[10px] text-zinc-500 truncate">{user?.email || 'opendev.office@gmail.com'}</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? <Moon className="size-4 text-zinc-700" /> : <Sun className="size-4 text-amber-400" />}
              </button>
              <button
                onClick={logout}
                className="text-zinc-400 hover:text-zinc-900 transition-colors p-1"
                title="Logout"
              >
                <ChevronDown className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
