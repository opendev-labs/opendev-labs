import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isFullWidthPage = isHomePage || location.pathname.startsWith('/open-hub') || location.pathname.startsWith('/user');

  if (isHomePage) {
    return (
      <div className="relative flex min-h-screen flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full flex-col bg-background text-foreground font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            <header className="h-14 border-b border-sidebar-border flex items-center px-4 shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger />
            </header>
            <main className={`flex-1 overflow-auto ${isFullWidthPage ? 'pt-0' : 'p-6 md:p-12 lg:p-16'}`}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
