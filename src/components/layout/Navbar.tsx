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
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useAISupport } from '../../context/AISupportContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { openSupport } = useAISupport();

  const navItems = [
    { label: 'AI', path: '/ai' },
    { label: 'Templates', path: '/templates' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Pricing', path: '/pricing' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo-icon.webp"
            alt="OpenDev-Labs Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white">
              opendev<span className="text-zinc-500 dark:text-zinc-400">-labs</span>
            </span>
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 -mt-0.5 tracking-wider uppercase">
              Engineering & Automation
            </span>
          </div>
        </Link>

        {/* Desktop Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold p-1 rounded-full bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  active
                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-md'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & ALWAYS-VISIBLE TOP-RIGHT END DARK MODE SWITCH */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* User Auth Buttons (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">

                <Button
                  size="sm"
                  onClick={() => navigate(user.role === 'developer' ? '/dashboard' : '/client/portal')}
                  className="text-xs font-extrabold h-9 px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full shadow-md transition-transform hover:scale-105 flex items-center gap-2"
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
                  className="text-xs font-extrabold h-9 px-4.5 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full shadow-md transition-transform hover:scale-105"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger / Dropdown Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="size-5 text-zinc-900 dark:text-white" /> : <Menu className="size-5" />}
          </button>

          {/* TOP RIGHT END DARK MODE ICON TOGGLE */}
          <button
            onClick={toggleTheme}
            className="size-9 rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-xs hover:scale-105 ml-1 shrink-0"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="size-4 text-zinc-800 transition-transform hover:-rotate-12" />
            ) : (
              <Sun className="size-4 text-amber-400 transition-transform hover:rotate-45" />
            )}
          </button>
        </div>
      </div>
    </header>

    {/* Runway-Style Mobile Dropdown Overlay Menu (Positioned directly under fixed header bar) */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-16 left-0 right-0 bottom-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-zinc-900 dark:text-zinc-100 md:hidden opacity-100"
          style={{ backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff' }}
        >
          {/* Menu List - Runway Typography Style */}
          <div className="flex flex-col my-auto py-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-4 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors"
            >
              Home
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-4 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSupport();
              }}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400 hover:text-purple-500 py-4 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors text-left flex items-center justify-between"
            >
              <span>24/7 AI Support</span>
              <Bot className="size-8 text-cyan-400" />
            </button>
          </div>

          {/* Bottom Stack Action Buttons */}
          <div className="pt-4 space-y-3">
            {isAuthenticated && user ? (
              <>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(user.role === 'developer' ? '/dashboard' : '/client/portal');
                  }}
                  className="w-full h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center transition-transform active:scale-95"
                >
                  My {user.role === 'developer' ? 'Studio Dashboard' : 'Client Portal'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full h-12 bg-white text-black hover:bg-zinc-100 font-extrabold text-sm uppercase tracking-widest rounded-xl border border-zinc-300 shadow-md flex items-center justify-center transition-transform active:scale-95"
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth');
                  }}
                  className="w-full h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center transition-transform active:scale-95"
                >
                  Get Started
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth');
                  }}
                  className="w-full h-12 bg-white text-black hover:bg-zinc-100 font-extrabold text-sm uppercase tracking-widest rounded-xl border border-zinc-300 shadow-md flex items-center justify-center transition-transform active:scale-95"
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};
