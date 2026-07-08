import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/void/hooks/useAuth';
import { OpenDevLogo } from '../features/void/components/common/Icons';
import { Github, Twitter, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const isOpenStudioRoute = pathname.startsWith('/open-studio');
    const isHomePage = pathname === '/';
    if (isOpenStudioRoute) return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
                <div className="mr-4 hidden md:flex items-center">
                    {!isHomePage && (
                        <SidebarTrigger className="mr-2 h-8 w-8" />
                    )}
                    <Link to="/" className="mr-6 flex items-center space-x-2">
                        <OpenDevLogo className="h-5 w-5" />
                        <span className="hidden font-bold sm:inline-block">
                            opendev-labs
                        </span>
                    </Link>
                    <nav className="flex items-center gap-4 text-sm lg:gap-6">
                        <Link 
                            to="/nanopi" 
                            className={`transition-colors hover:text-foreground/80 ${pathname.startsWith('/nanopi') ? 'text-foreground' : 'text-foreground/60'}`}
                        >
                            NanoPi
                        </Link>
                        <Link 
                            to="/open-hub" 
                            className={`transition-colors hover:text-foreground/80 ${pathname.startsWith('/open-hub') ? 'text-foreground' : 'text-foreground/60'}`}
                        >
                            Hub
                        </Link>
                        <Link 
                            to="/docs" 
                            className={`transition-colors hover:text-foreground/80 ${pathname.startsWith('/docs') ? 'text-foreground' : 'text-foreground/60'}`}
                        >
                            Docs
                        </Link>
                    </nav>
                </div>
                
                {/* Mobile Menu Trigger */}
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </button>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search could go here */}
                    </div>
                    <nav className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 px-0">
                            <a href="https://github.com/opendev-labs" target="_blank" rel="noreferrer">
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 px-0 hidden sm:inline-flex">
                            <a href="https://twitter.com/opendevlabs" target="_blank" rel="noreferrer">
                                <Twitter className="h-4 w-4 fill-current" />
                                <span className="sr-only">Twitter</span>
                            </a>
                        </Button>
                        <div className="ml-2">
                            {isAuthenticated ? (
                                <Button onClick={logout} variant="secondary" className="h-8 px-3 text-xs">
                                    Sign Out
                                </Button>
                            ) : (
                                <Button onClick={() => navigate('/auth')} className="h-8 px-3 text-xs">
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};
