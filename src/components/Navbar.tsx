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
    <nav className="sticky top-0 z-50 w-full border-b border-black bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/book" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-6 h-6 bg-black flex items-center justify-center text-white font-bold text-xs">
              OD
            </div>
            <span className="text-sm font-bold text-black hidden sm:inline">OPENDEV LABS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link to="/book" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
              Book
            </Link>
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
              Dashboard
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-6 h-6 border border-black"
                      crossOrigin="anonymous"
                    />
                  )}
                  <span className="text-black font-medium text-xs">{user.name?.split(' ')[0]?.toUpperCase()}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-gray-600 hover:text-black transition-colors border border-black px-3 py-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-black"
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
          <div className="md:hidden border-t border-black py-4">
            <div className="flex flex-col gap-4">
              <Link to="/book" className="text-sm text-black hover:text-gray-600 transition-colors px-0 font-medium">
                Book
              </Link>
              <Link to="/dashboard" className="text-sm text-black hover:text-gray-600 transition-colors px-0 font-medium">
                Dashboard
              </Link>
              {user && (
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-gray-600 hover:text-black transition-colors border border-black px-3 py-2 mt-2"
                >
                  <LogOut className="w-4 h-4 mr-2 inline" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
