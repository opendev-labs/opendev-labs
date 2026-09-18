import React, { useState } from 'react';
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
  ChevronUp,
  Home,
  Globe,
  PlusCircle,
  HelpCircle,
  ExternalLink,
  Sun,
  Moon,
  CreditCard,
  Zap,
  Activity,
  Key,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../context/ClientContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { SettingsModal } from '../modals/SettingsModal';

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAddClient: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
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
  mobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();
  const { user, registeredUsers, logout } = useAuth();
  const { clients } = useClients();
  const { theme, toggleTheme } = useTheme();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const overdueCount = clients.filter(c => c.status === 'overdue').length;
  const isDev = user?.role === 'developer';

  const devNavItems: NavItem[] = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Clients CRM', path: '/dashboard/clients', icon: Building },
    { title: 'Registered Users', path: '/dashboard/clients?tab=users', icon: Users, badge: registeredUsers.length },
    { title: 'Payment Reminders', path: '/dashboard/reminders', icon: BellRing, badge: overdueCount > 0 ? `${overdueCount}` : undefined, badgeVariant: 'destructive' },
    { title: 'Invoices & Ledger', path: '/dashboard/invoices', icon: ReceiptText },
    { title: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const userNavItems: NavItem[] = [
    { title: 'Profile', path: '/client/profile', icon: Users },
    { title: 'Client Portal', path: '/client/convert', icon: Key },
    { title: 'Security & Info', path: '/client/security', icon: Settings },
  ];

  const clientNavItems: NavItem[] = [
    { title: 'Dashboard & Specs', path: '/client/portal', icon: LayoutDashboard },
    { title: 'Payments & Retainer', path: '/client/payments', icon: CreditCard },
    { title: 'Invoices & Receipts', path: '/client/invoices', icon: ReceiptText },
    { title: 'Support & Tickets', path: '/client/support', icon: HelpCircle },
    { title: 'Milestones & Roadmap', path: '/client/milestones', icon: Zap },
    { title: 'Vault Credentials', path: '/client/credentials', icon: Key },
    { title: 'User Profile', path: '/client/profile', icon: Users },
  ];

  const navItems = isDev ? devNavItems : user?.role === 'user' ? userNavItems : clientNavItems;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      <aside
        className={cn(
          'flex flex-col h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-[width] duration-300 ease-in-out z-30 select-none shrink-0 overflow-x-hidden',
          'fixed inset-y-0 left-0 md:relative',
          mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:transform-none',
          collapsed ? 'md:w-16' : 'md:w-60'
        )}
      >
        {/* Top Logo Header */}
        <div className={cn(
          "flex items-center h-16 border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300 relative shrink-0",
          collapsed && !mobileOpen ? "justify-center px-2" : "justify-between px-4"
        )}>
          {collapsed && !mobileOpen ? (
            <button
              onClick={onToggleCollapse}
              className="group flex items-center justify-center p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all relative cursor-pointer"
              title="Expand Sidebar"
            >
              <img
                src="/logo-icon.webp"
                alt="OpenDev-Labs"
                className="h-11 w-auto max-h-11 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Floating Hover Tooltip for Logo Header in Collapsed Mode */}
              <div className="fixed left-16 top-4 ml-3 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 pointer-events-none z-50 transition-all duration-150 ease-out border border-zinc-800 dark:border-zinc-200 flex items-center gap-1.5 after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-zinc-900 dark:after:border-r-zinc-100">
                <span>Expand Sidebar</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 dark:bg-zinc-200 text-zinc-300 dark:text-zinc-700 text-[9px] font-mono">⌘B</kbd>
              </div>
            </button>
          ) : (
            <>
              <Link to="/" onClick={onCloseMobile} className="flex items-center gap-3 overflow-hidden">
                <img src="/logo-icon.webp" alt="OpenDev-Labs" className="h-9 w-auto object-contain shrink-0" onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }} />
                <div className="flex flex-col truncate">
                  <span className="font-extrabold text-xs tracking-wider uppercase text-zinc-900 dark:text-white leading-tight">
                    OPENDEV-LABS
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                    {isDev ? 'Developer Portal' : user?.role === 'user' ? 'Registered Gateway' : 'Client Gateway'}
                  </span>
                </div>
              </Link>

              {/* Desktop Collapse / Expand Button */}
              <button
                onClick={onToggleCollapse}
                className="hidden md:flex p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                title="Close Sidebar"
              >
                <ChevronLeft className="size-4" />
              </button>

              {/* Mobile Close Button */}
              {mobileOpen && (
                <button
                  onClick={onCloseMobile}
                  className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 sm:px-3 space-y-6">
          
          {/* Menu Section */}
          <div>
            {(!collapsed || mobileOpen) && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                MENU
              </div>
            )}

            <div className="space-y-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const fullPath = location.pathname + location.search;
                const isActive = fullPath === item.path || (item.path === '/dashboard/clients' && location.pathname === '/dashboard/clients' && !location.search.includes('tab=users'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={cn(
                      'flex items-center text-xs font-semibold transition-all relative group rounded-xl',
                      collapsed && !mobileOpen
                        ? 'justify-center size-10 mx-auto hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        : isActive
                          ? 'gap-3 px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                          : 'gap-3 px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className={cn(
                      collapsed && !mobileOpen
                        ? isActive ? 'size-5 text-black dark:text-white stroke-[2.5] scale-110 transition-all' : 'size-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-all'
                        : isActive ? 'size-4 text-white dark:text-zinc-900 shrink-0' : 'size-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white shrink-0'
                    )} />
                    
                    {(!collapsed || mobileOpen) && <span className="truncate whitespace-nowrap flex-1">{item.title}</span>}

                    {(!collapsed || mobileOpen) && item.badge !== undefined && (
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-bold',
                        item.badgeVariant === 'destructive'
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                          : isActive ? 'bg-zinc-800 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      )}>
                        {item.badge}
                      </span>
                    )}

                    {/* Notification Badge Dot for Collapsed Mode */}
                    {collapsed && !mobileOpen && item.badge !== undefined && (
                      <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
                    )}

                    {/* Professional Floating Hover Tooltip with Pointer Arrow for Collapsed Sidebar */}
                    {collapsed && !mobileOpen && (
                      <div className="fixed left-16 ml-3 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 pointer-events-none z-50 transition-all duration-150 ease-out flex items-center gap-2 border border-zinc-800 dark:border-zinc-200 after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-zinc-900 dark:after:border-r-zinc-100">
                        <span>{item.title}</span>
                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500 text-white font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Bottom Rail Expand Button in Collapsed Mode */}
            {collapsed && !mobileOpen && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 mt-3">
                <button
                  onClick={onToggleCollapse}
                  className="flex items-center justify-center size-10 mx-auto rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all relative group"
                  title="Expand Sidebar"
                >
                  <ChevronRight className="size-4" />
                  <div className="fixed left-16 ml-3 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 pointer-events-none z-50 transition-all duration-150 ease-out border border-zinc-800 dark:border-zinc-200 flex items-center gap-1.5 after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-zinc-900 dark:after:border-r-zinc-100">
                    <span>Expand Sidebar</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

      {/* Bottom User Card */}
      <div className={cn(
        "border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 relative transition-all duration-300 shrink-0 overflow-x-hidden",
        collapsed && !mobileOpen ? "p-2" : "p-3"
      )}>
        
        {/* Drop-Up Popover / Flyout Menu */}
        {popoverOpen && (
          <>
            {/* Backdrop overlay to close menu on outside click */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setPopoverOpen(false)}
            />
            <div className={cn(
              "p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 animate-in fade-in space-y-1 min-w-[210px]",
              collapsed && !mobileOpen
                ? "fixed left-16 bottom-3 ml-3 slide-in-from-left-2"
                : "absolute left-3 right-3 bottom-full mb-2 slide-in-from-bottom-2"
            )}>
              
              {/* User Profile Header in Drop-Up */}
              <div className="px-2.5 py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2.5">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="size-8 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="size-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                    {user?.name || 'User Account'}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                    {user?.email || 'Registered User'}
                  </span>
                </div>
              </div>

              {/* Settings Option */}
              <button
                onClick={() => {
                  setPopoverOpen(false);
                  setSettingsOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors text-left"
              >
                <Settings className="size-4 text-zinc-500" />
                <span>Settings</span>
              </button>

              {/* Log Out Option */}
              <button
                onClick={() => {
                  setPopoverOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors text-left"
              >
                <LogOut className="size-4 text-red-500" />
                <span>Log out</span>
              </button>
            </div>
          </>
        )}

        {/* User Card Content */}
        <div
          onClick={() => setPopoverOpen(!popoverOpen)}
          className={cn(
            "rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all group relative",
            collapsed && !mobileOpen ? "size-10 mx-auto p-1 justify-center" : "p-2.5"
          )}
        >
          <div className={cn("flex items-center min-w-0 relative", collapsed && !mobileOpen ? "justify-center" : "gap-2.5")}>
            {/* User Profile Picture Avatar */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="size-8 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="size-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name.charAt(0) : 'Y'}
              </div>
            )}

            {/* Online Status Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />

            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {user?.name || 'Yash Ramteke'}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  {user?.email || 'opendev.office@gmail.com'}
                </span>
              </div>
            )}
          </div>

          {/* ChevronUp Arrow-Up Toggle Button when Expanded */}
          {(!collapsed || mobileOpen) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPopoverOpen(!popoverOpen);
              }}
              className={cn(
                "p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all",
                popoverOpen && "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white"
              )}
              title="Account Options"
            >
              <ChevronUp className="size-4" />
            </button>
          )}

          {/* Floating Tooltip for User Avatar in Collapsed Mode */}
          {collapsed && !mobileOpen && (
            <div className="fixed left-16 ml-3 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 pointer-events-none z-50 transition-all duration-150 ease-out border border-zinc-800 dark:border-zinc-200 flex items-center gap-1.5 after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-zinc-900 dark:after:border-r-zinc-100">
              <span>{user?.name || 'User Profile'}</span>
              <span className="text-[10px] opacity-75 font-mono">Options</span>
            </div>
          )}
        </div>
      </div>

      {/* Account Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </aside>
  </>
);
};
