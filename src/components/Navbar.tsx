import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              OD
            </div>
            <span className="text-xl font-bold text-foreground">OpenDev</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#portfolio" className="text-foreground/70 hover:text-foreground transition-colors">
              Portfolio
            </a>
            <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-foreground hover:bg-destructive/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a
              href="#services"
              className="block text-foreground/70 hover:text-foreground transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#portfolio"
              className="block text-foreground/70 hover:text-foreground transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Portfolio
            </a>
            <a
              href="#about"
              className="block text-foreground/70 hover:text-foreground transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <div className="pt-3 border-t border-border">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border mb-3">
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-full text-foreground hover:bg-destructive/10"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button size="sm" className="w-full">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
