import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/book" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-sm">
              OD
            </div>
            <span className="text-lg font-semibold text-foreground hidden sm:inline">OpenDev Labs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link to="/book" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            {user && (
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                      crossOrigin="anonymous"
                    />
                  )}
                  <span className="text-foreground font-medium">{user.name?.split(' ')[0]}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border border-border text-foreground hover:bg-secondary"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col gap-4">
              <Link to="/book" className="text-sm text-foreground hover:text-muted-foreground transition-colors px-4">
                Home
              </Link>
              <a href="#services" className="text-sm text-foreground hover:text-muted-foreground transition-colors px-4">
                Services
              </a>
              {user && (
                <Link to="/dashboard" className="text-sm text-foreground hover:text-muted-foreground transition-colors px-4">
                  Dashboard
                </Link>
              )}
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border border-border mx-4"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
