import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { CommandPaletteModal } from '../modals/CommandPaletteModal';
import { AddClientModal } from '../modals/AddClientModal';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Strict Role Redirection Enforcement
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
      return;
    }

    if ((user?.role === 'client' || user?.role === 'user') && location.pathname.startsWith('/dashboard')) {
      navigate('/client/portal', { replace: true });
    } else if (user?.role === 'developer' && location.pathname.startsWith('/client')) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isAuthenticated, location.pathname, navigate]);

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-black dark:selection:text-white transition-colors duration-200">
      {/* Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onOpenAddClient={() => setAddClientOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <Header
          onOpenCommand={() => setCommandOpen(true)}
          onOpenAddClient={() => setAddClientOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-2">
          <Outlet context={{ onOpenAddClient: () => setAddClientOpen(true) }} />
        </main>
      </div>

      {/* Modals */}
      <CommandPaletteModal
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onOpenAddClient={() => setAddClientOpen(true)}
      />

      <AddClientModal
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
      />
    </div>
  );
};
