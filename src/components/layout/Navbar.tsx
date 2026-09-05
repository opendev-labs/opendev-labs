import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Terminal,
  Code2,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: 'Solutions', path: '/solutions' },
    { label: 'Pricing', path: '/pricing' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo-icon.webp"
            alt="OpenDev-Labs Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white flex items-center gap-1">
              opendev<span className="text-blue-600 dark:text-blue-400">-labs</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold -mt-1 tracking-wider uppercase">
              Engineering & Automation
            </span>
          </div>
        </Link>

        {/* Desktop Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  active
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="/iamyashramteke/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all flex items-center gap-1"
          >
            Yash Portfolio <ExternalLink className="size-3 text-zinc-400" />
          </a>
        </nav>

        {/* Right Actions & ALWAYS-VISIBLE TOP-RIGHT DARK MODE SWITCH */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* TOP RIGHT CORNER DARK MODE ICON TOGGLE */}
          <button
            onClick={toggleTheme}
            className="size-9 rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-xs hover:scale-105"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="size-4 text-zinc-800 transition-transform hover:-rotate-12" />
            ) : (
              <Sun className="size-4 text-amber-400 transition-transform hover:rotate-45" />
            )}
          </button>

          {/* User Auth Buttons (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => navigate(user.role === 'developer' ? '/dashboard' : '/client/portal')}
                  className="text-xs font-extrabold h-9 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full shadow-sm transition-transform hover:scale-105 flex items-center gap-2"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="size-4 rounded-full object-cover" />
                  ) : null}
                  <span>My {user.role === 'developer' ? 'Studio' : 'Portal'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-xs font-semibold h-9 px-3 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 rounded-full"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="text-xs font-semibold h-9 px-3.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="text-xs font-extrabold h-9 px-4.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-transform hover:scale-105"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Top drawer bar */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-zinc-900 dark:text-white">
                  opendev<span className="text-blue-600 dark:text-blue-400">-labs</span>
                </span>
              </Link>
              
              <div className="flex items-center gap-3">
                {/* Mobile Drawer Theme Switch */}
                <button
                  onClick={toggleTheme}
                  className="size-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
                >
                  {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4 text-amber-400" />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-3 py-8">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-zinc-900 dark:text-white hover:text-blue-600 py-2 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between"
              >
                Home <ChevronRight className="size-4 text-zinc-400" />
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-zinc-900 dark:text-white hover:text-blue-600 py-2 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between"
                >
                  {item.label} <ChevronRight className="size-4 text-zinc-400" />
                </Link>
              ))}
              <a
                href="/iamyashramteke/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-blue-600 dark:text-blue-400 py-2 flex items-center justify-between"
              >
                Yash Portfolio <ExternalLink className="size-4" />
              </a>
            </div>

            {/* Mobile Auth Bottom Bar */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(user.role === 'developer' ? '/dashboard' : '/client/portal');
                    }}
                    className="w-full h-11 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-sm rounded-xl"
                  >
                    My {user.role === 'developer' ? 'Studio Dashboard' : 'Client Portal'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full h-10 text-red-600 font-bold text-xs"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/auth');
                    }}
                    className="w-full h-11 bg-blue-600 text-white font-extrabold text-sm rounded-xl"
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/auth');
                    }}
                    className="w-full h-11 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold text-sm rounded-xl"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
