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
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8 mx-auto">
                    
                    {/* Left: Brand Logo & Desktop Nav */}
                    <div className="flex items-center space-x-6">
                        {!isHomePage && (
                            <SidebarTrigger className="mr-1 h-8 w-8 hidden md:flex" />
                        )}
                        <Link to="/" className="flex items-center space-x-2.5 group">
                            <img src="/logo-icon.webp" alt="OpenDev-Labs" className="h-7 w-auto object-contain transition-transform group-hover:scale-105" />
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
                        {/* Dark Mode Switch Icon */}
                        <button
                            onClick={toggleTheme}
                            className="size-8 rounded-lg bg-secondary border border-border text-foreground flex items-center justify-center hover:bg-muted transition-all"
                            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        >
                            {theme === 'light' ? <Moon className="size-4 text-zinc-800 dark:text-zinc-200" /> : <Sun className="size-4 text-amber-400" />}
                        </button>

                        <div className="hidden sm:flex items-center space-x-2">
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground">
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
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Backdrop & Slide-Over Drawer */}
            <div className={`mobile-nav-backdrop ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(false)}>
                <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
                    <div className="mobile-drawer-header">
                        <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-lg bg-[#f02050] flex items-center justify-center">
                                <OpenDevLogo className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-sm text-white">opendev-labs</span>
                        </div>
                        <button onClick={() => setMobileNavOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mobile-nav-links">
                        {navItems.map((item) => {
                            const IconComp = item.icon;
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileNavOpen(false)}
                                    className={pathname === item.reactPath || pathname === item.href ? 'active' : ''}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <IconComp className="w-4 h-4 text-[#f02050]" />
                                        <span>{item.label}</span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                                </a>
                            );
                        })}
                    </div>

                    <div className="mt-auto pt-6 border-t border-[#27272a] space-y-3">
                        <a 
                            href="/booking.html" 
                            onClick={() => setMobileNavOpen(false)}
                            className="w-full flex items-center justify-center gap-2 h-11 bg-gradient-to-r from-[#f02050] to-[#ff4d73] text-white font-bold text-xs rounded-xl shadow-lg"
                        >
                            Book Custom Project
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};
