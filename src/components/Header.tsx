import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/void/hooks/useAuth';

export const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isOpenStudioRoute = pathname.startsWith('/open-studio');
    if (isOpenStudioRoute) return null;

    const isFullWidthPage = pathname === '/' || pathname.startsWith('/open-hub');

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            scrolled 
            ? 'border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md shadow-sm' 
            : 'border-b border-transparent bg-transparent'
        }`}>
            <div className={`mx-auto flex h-14 ${isFullWidthPage ? 'max-w-full px-6' : 'max-w-[1100px] px-6'} items-center justify-between`}>
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="shrink-0 flex items-center justify-center h-7 w-7">
                            <div className="h-5 w-5 rounded-full bg-orange-500 group-hover:bg-orange-400 transition-colors shadow-[0_0_10px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_16px_rgba(249,115,22,0.6)]" />
                        </div>
                        <span className="text-[14px] font-extrabold text-white tracking-tight lowercase">
                            opendev-<span className="text-orange-500 font-mono">labs</span>
                        </span>
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-5 text-[12px] font-medium tracking-tight">
                        <Link 
                            to="/open-studio" 
                            className={`transition-colors relative py-1 ${
                                pathname.startsWith('/open-studio') ? 'text-orange-500 font-semibold' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            IDE
                            {pathname.startsWith('/open-studio') && (
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500" />
                            )}
                        </Link>
                        <Link 
                            to="/open-hub" 
                            className={`transition-colors relative py-1 ${
                                pathname.startsWith('/open-hub') ? 'text-orange-500 font-semibold' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Hub
                            {pathname.startsWith('/open-hub') && (
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500" />
                            )}
                        </Link>
                        <Link 
                            to="/docs" 
                            className={`transition-colors relative py-1 ${
                                pathname.startsWith('/docs') ? 'text-orange-500 font-semibold' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Docs
                            {pathname.startsWith('/docs') && (
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500" />
                            )}
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <a 
                        href="https://github.com/opendev-labs" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hidden sm:flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[11px] text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-medium"
                    >
                        <span>GitHub</span>
                        <span className="flex h-3.5 items-center rounded-sm bg-zinc-800 px-1 text-[9px] text-zinc-400 font-bold">Star</span>
                    </a>
                    
                    {isAuthenticated ? (
                        <button 
                            onClick={logout}
                            className="rounded bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors uppercase tracking-wider"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate('/auth')}
                            className="rounded bg-orange-600 px-4 py-1.5 text-[11px] font-bold text-white hover:bg-orange-500 transition-all uppercase tracking-wider"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
