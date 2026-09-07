import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OpenDevLogo } from '../features/void/components/common/Icons';
import { useTheme } from '../context/ThemeContext';
import { Github, Twitter, Menu, X, ArrowRight, Code, ShoppingBag, Cpu, Globe, DollarSign, BookOpen, Layers, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const isOpenStudioRoute = pathname.startsWith('/open-studio');
    const isHomePage = pathname === '/';
    if (isOpenStudioRoute) return null;

    const navItems = [
        { label: 'Software Services', href: '/booking.html', reactPath: '/booking', icon: Code },
        { label: 'Templates', href: '/marketplace.html', reactPath: '/marketplace', icon: ShoppingBag },
        { label: 'Web-AI & Vercel', href: '/ai-cloud.html', reactPath: '/ai-cloud', icon: Cpu },
        { label: 'Managed Domains', href: '/domains.html', reactPath: '/domains', icon: Globe },
        { label: 'Pricing', href: '/pricing', reactPath: '/pricing', icon: DollarSign },
        { label: 'NanoPi AI', href: '/nanopi', reactPath: '/nanopi', icon: Layers },
        { label: 'Docs', href: '/docs', reactPath: '/docs', icon: BookOpen },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8 mx-auto">
                    
                    {/* Left: Brand Logo & Desktop Nav */}
                    <div className="flex items-center space-x-6">
                        {!isHomePage && (
                            <SidebarTrigger className="mr-1 h-8 w-8 hidden md:flex" />
                        )}
                        <Link to="/" className="flex items-center space-x-2.5 group">
                            <img src="/logo-icon.webp" alt="OpenDev-Labs" className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
                            <span className="font-bold text-base tracking-tight text-foreground">
                                opendev<span className="text-muted-foreground">-labs</span>
                            </span>
                        </Link>

                        <nav className="hidden lg:flex items-center space-x-5 text-xs font-medium">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className={`transition-colors hover:text-[#f02050] ${
                                        pathname === item.reactPath || pathname === item.href 
                                            ? 'text-foreground font-semibold' 
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Right Actions & Mobile Toggle */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground">
                                <a href="https://github.com/opendev-labs" target="_blank" rel="noreferrer">
                                    <Github className="h-4 w-4" />
                                    <span className="sr-only">GitHub</span>
                                </a>
                            </Button>
                        </div>

                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => navigate(user.role === 'developer' ? '/dashboard' : '/client/portal')}
                                    variant="secondary"
                                    className="h-9 px-3 text-xs font-bold flex items-center gap-1.5"
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="size-4 rounded-full object-cover" />
                                    ) : null}
                                    <span>My {user.role === 'developer' ? 'Dashboard' : 'Portal'}</span>
                                </Button>
                                <Button onClick={logout} variant="ghost" className="h-9 px-2 text-xs font-medium text-muted-foreground hover:text-destructive">
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Link to="/auth" className="inline-flex items-center justify-center rounded-xl bg-[#f02050] hover:bg-[#d01840] text-white px-4 h-9 text-xs font-bold shadow-md shadow-[#f02050]/20 transition-all">
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Hamburger Button */}
                        <button
                            type="button"
                            onClick={() => setMobileNavOpen(!mobileNavOpen)}
                            className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl bg-[#18181b] border border-[#27272a] text-white hover:border-[#f02050] transition-colors"
                            aria-label="Toggle Navigation Menu"
                        >
                            {mobileNavOpen ? <X className="h-5 w-5 text-[#f02050]" /> : <Menu className="h-5 w-5" />}
                        </button>

                        {/* Dark Mode Switch Icon - Top Right End */}
                        <button
                            onClick={toggleTheme}
                            className="size-8 rounded-lg bg-secondary border border-border text-foreground flex items-center justify-center hover:bg-muted transition-all shrink-0"
                            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon className="size-4 text-zinc-800 dark:text-zinc-200" /> : <Sun className="size-4 text-amber-400" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Runway-Style Overlay Menu */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-[9999] bg-white dark:bg-zinc-950 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto text-zinc-900 dark:text-zinc-100">
                    {/* Top Bar: Brand Logo & Close Button */}
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                        <Link to="/" onClick={() => setMobileNavOpen(false)} className="flex items-center space-x-2.5">
                            <img src="/logo-icon.webp" alt="OpenDev-Labs" className="h-10 w-auto object-contain" />
                            <span className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">
                                opendev<span className="text-[#f02050]">-labs</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="size-9 rounded-full bg-secondary border border-border text-foreground flex items-center justify-center"
                                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                            >
                                {theme === 'light' ? <Moon className="size-4 text-zinc-800" /> : <Sun className="size-4 text-amber-400" />}
                            </button>
                            <button
                                onClick={() => setMobileNavOpen(false)}
                                className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                <X className="size-7" />
                            </button>
                        </div>
                    </div>

                    {/* Menu List - Runway Typography Style */}
                    <div className="flex flex-col my-auto py-6">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileNavOpen(false)}
                                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white hover:text-[#f02050] py-4 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Bottom Action Stack */}
                    <div className="pt-4 space-y-3">
                        <Button
                            onClick={() => {
                                setMobileNavOpen(false);
                                navigate('/auth');
                            }}
                            className="w-full h-12 bg-[#f02050] hover:bg-[#d01840] text-white font-extrabold text-sm rounded-xl shadow-md"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
