import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isFullWidthPage = isHomePage || location.pathname.startsWith('/open-hub') || location.pathname.startsWith('/user');

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-red-500/20 selection:text-white font-sans flex flex-col">
      <Header />
      <main className={`flex-1 ${isFullWidthPage ? 'pt-0' : 'pt-14 px-6 md:px-12 lg:px-16'}`}>
        <Outlet />
      </main>
      {isHomePage && <Footer />}
    </div>
  );
}
