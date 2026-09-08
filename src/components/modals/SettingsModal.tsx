import React from 'react';
import { createPortal } from 'react-dom';
import { Settings, User, Moon, Sun, Shield, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!open) return null;

  // Check if current user is authenticated via Google
  const isGoogleUser =
    user?.authMethod === 'google' ||
    user?.email?.toLowerCase().endsWith('@gmail.com') ||
    user?.id?.startsWith('user-g-');

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      {/* Modal Dialog Card (Centered on Screen) */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-zinc-900 dark:text-zinc-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-base">Account Settings</h3>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* User Profile Info Card */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="size-14 rounded-full object-cover border-2 border-blue-500/40 shadow-sm shrink-0"
              />
            ) : (
              <div className="size-14 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xl flex items-center justify-center shadow-sm shrink-0">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
            )}

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </span>
                {isGoogleUser && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 shrink-0">
                    Google Auth
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {user?.email || 'No email registered'}
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 capitalize mt-0.5">
                Role: {user?.role || 'Guest'}
              </span>
            </div>
          </div>

          {/* Theme Settings Section (ONLY for Google Logged In Users) */}
          {isGoogleUser ? (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {theme === 'light' ? (
                    <Sun className="size-5 text-amber-500" />
                  ) : (
                    <Moon className="size-5 text-blue-400" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                      Appearance Theme
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Currently using <span className="capitalize font-semibold text-zinc-700 dark:text-zinc-300">{theme} mode</span>
                    </p>
                  </div>
                </div>

                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="size-3.5" /> Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="size-3.5" /> Light Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Shield className="size-4 text-zinc-400 shrink-0" />
              <span>Dark mode theme toggle is enabled exclusively for Google authenticated users.</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                logout();
              }}
              className="text-xs flex items-center gap-1.5"
            >
              <LogOut className="size-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
