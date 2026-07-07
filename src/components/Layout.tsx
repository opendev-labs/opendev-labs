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

  return (
    <SidebarProvider defaultOpen={!isHomePage}>
      <div className="relative flex min-h-screen w-full flex-col bg-background text-foreground font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {!isHomePage && <AppSidebar />}
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            <main className={`flex-1 overflow-auto ${isFullWidthPage ? 'pt-0' : 'p-6 md:p-12 lg:p-16'}`}>
              <Outlet />
            </main>
          </div>
        </div>
        {isHomePage && <Footer />}
      </div>
    </SidebarProvider>
  );
}
