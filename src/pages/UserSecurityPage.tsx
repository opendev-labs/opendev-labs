import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Moon,
  Sun,
  Bot,
  LogOut,
  User,
  Lock,
  Shield,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAISupport } from '../context/AISupportContext';

export const UserSecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAIEnabled, setAIEnabled } = useAISupport();

  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isGoogleUser =
    user?.authMethod === 'google' ||
    user?.email?.toLowerCase().endsWith('@gmail.com') ||
    user?.id?.startsWith('user-g-');

  const userName = user?.name || (user?.email ? user.email.split('@')[0] : 'Member');
  const userEmail = user?.email || 'user@opendev-labs.com';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Settings & Security
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Manage your account security parameters, system appearance, AI copilot, and active session controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Session Active & Secure
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: User Account Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
            
            {/* Avatar & Basic Info */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={userName}
                    className="size-20 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md mx-auto"
                  />
                ) : (
                  <div className="size-20 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-2xl flex items-center justify-center shadow-md mx-auto">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 size-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" title="Online" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {userName}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[220px] mx-auto">
                  {userEmail}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 uppercase tracking-wide">
                <Shield className="size-3.5" />
                {user?.role === 'developer' ? 'Developer Admin' : user?.role === 'client' ? 'Client Partner' : 'Standard User'}
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800" />

            {/* Account Details List */}
            <div className="space-y-4 text-xs">
              
              {/* User ID */}
              <div>
                <span className="text-zinc-400 font-semibold block mb-1">Unique User ID</span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px]">
                  <span className="truncate text-zinc-800 dark:text-zinc-200 font-bold max-w-[180px]">
                    {user?.id || 'N/A'}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    title="Copy User ID"
                  >
                    {copiedId ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* Security Protection */}
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Auth Protection:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Google OAuth 2.0
                </span>
              </div>

              {/* Agency Platform */}
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Agency Suite:</span>
                <span className="font-bold text-zinc-900 dark:text-white">OpenDev-Labs</span>
              </div>

              {/* Encryption */}
              <div className="flex justify-between py-2">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Data Transit:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">TLS 1.3 / AES-256</span>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Settings & Security Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: System & Appearance Preferences */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Sparkles className="size-5 text-indigo-500" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                App & Interface Settings
              </h2>
            </div>

            <div className="space-y-4">
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-blue-500/10 dark:text-blue-400">
                    {theme === 'dark' ? <Moon className="size-5" /> : <Sun className="size-5" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                      Appearance Theme
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Currently using <span className="font-semibold text-zinc-700 dark:text-zinc-300 capitalize">{theme} mode</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    theme === 'dark' ? 'bg-indigo-600 justify-end' : 'bg-zinc-300 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="size-5 rounded-full bg-white shadow-md"
                  />
                </button>
              </div>

              {/* 24/7 AI Support Chat Widget Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                      24/7 AI Support Assistant
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Enable floating AI copilot widget for instant project help
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAIEnabled(!isAIEnabled)}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    isAIEnabled ? 'bg-blue-600 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="size-5 rounded-full bg-white shadow-md"
                  />
                </button>
              </div>

            </div>
          </div>

          {/* Section 2: Security & Authentication Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Lock className="size-5 text-emerald-500" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Authentication & Credential Security
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card A: Single Sign-On */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <KeyRound className="size-5 text-indigo-500" />
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  Google Federated SSO
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Your account is secured via OAuth 2.0 token delegation. No passwords stored on OpenDev servers.
                </p>
              </div>

              {/* Card B: Session Encryption */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <Smartphone className="size-5 text-blue-500" />
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    Encrypted
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  Active Web Session
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Current session running over SSL/TLS HTTPS with automatic idle token validation.
                </p>
              </div>

            </div>
          </div>

          {/* Section 3: Danger Zone / Log Out Action */}
          <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 dark:bg-red-950/20 dark:border-red-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <LogOut className="size-4" /> Log Out of Session
                </h3>
                <p className="text-xs text-red-500/80 dark:text-red-400/80">
                  End your current active session on this device. You will need to sign in again to access the portal.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <LogOut className="size-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default UserSecurityPage;
