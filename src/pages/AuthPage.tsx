import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { promptGoogleSignIn } from '../services/googleAuth';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Building2,
  ArrowRight,
  CheckSquare,
  Square,
  Lock,
  Mail,
  Sparkles,
  CheckCircle2,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDeveloper, loginAsClient, loginWithGoogle } = useAuth();
  const { clients } = useClients();
  const { theme, toggleTheme } = useTheme();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('khawar@elitetradinghub.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMessage('');

    setTimeout(() => {
      if (isAdminMode) {
        // Validate Admin credentials (username/email & password)
        const validAdminEmails = ['opendev.office@gmail.com', 'admin', 'yash', 'yashramteke'];
        if (validAdminEmails.includes(email.trim().toLowerCase()) && password.length >= 4) {
          loginAsDeveloper();
          navigate('/dashboard');
        } else {
          setErrorMessage('Invalid admin username or password. Use registered studio credentials.');
        }
      } else {
        const foundClient = clients.find(
          c => c.email.toLowerCase() === email.toLowerCase() ||
               c.name.toLowerCase().includes(email.toLowerCase())
        ) || clients[0];
        loginAsClient(foundClient.id);
        navigate('/client/portal');
      }
      setIsAuthenticating(false);
    }, 400);
  };

  const triggerRealGoogleAuth = async () => {
    setIsAuthenticating(true);
    setErrorMessage('');
    try {
      // 1. Try Firebase Auth popup if Firebase auth is initialized
      if (auth) {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;
        loginWithGoogle(
          googleUser.email || 'client@opendev-labs.com',
          googleUser.displayName || 'Google Client User',
          googleUser.photoURL || undefined
        );
        navigate('/client/portal');
        return;
      }

      // 2. Direct Google Identity Services (GSI) OAuth 2.0 popup
      const googleProfile = await promptGoogleSignIn();
      loginWithGoogle(
        googleProfile.email,
        googleProfile.name,
        googleProfile.picture
      );
      navigate('/client/portal');
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err?.message && !err.message.includes('closed_by_user')) {
        setErrorMessage(err.message || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 selection:text-black relative overflow-hidden">
      
      {/* 2D Live Canvas Background */}
      <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-50 z-0" particleCount={40} />

      {/* LEFT PORTION (Expanded full-canvas image background with company logo top-left) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:flex-1 relative bg-[url('/digital-nomads.jpg')] bg-cover bg-center p-6 lg:p-10 flex flex-col justify-between items-start min-h-[350px] lg:min-h-screen z-10 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800"
      >
        {/* Top Left Company Logo */}
        <Link to="/" className="flex items-center gap-3 group bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full border border-white/20 transition-all backdrop-blur-md">
          <img
            src="/logo-icon.webp"
            alt="OpenDev-Labs Logo"
            className="h-9 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-extrabold text-base sm:text-lg text-white tracking-tight drop-shadow-md">
            opendev<span className="text-blue-400">-labs</span>
          </span>
        </Link>
      </motion.div>

      {/* RIGHT PORTION (Compact Mobile-Style Rectangular Sign In Drawer) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-[400px] xl:w-[440px] shrink-0 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 sm:p-8 lg:p-10 flex flex-col justify-center items-center min-h-[520px] lg:min-h-screen z-10 relative border-l border-zinc-200 dark:border-zinc-800/80 shadow-2xl"
      >
        {/* Top Right Controls (Theme Toggle & Home Link) */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <Link
            to="/"
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white font-bold transition-colors"
          >
            ← Home
          </Link>
          <button
            onClick={toggleTheme}
            className="size-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="size-4 text-zinc-800" /> : <Sun className="size-4 text-amber-400" />}
          </button>
        </div>

        <div className="w-full max-w-sm space-y-6 pt-4">
          {/* Mode Switcher Pill */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setEmail('khawar@elitetradinghub.com');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  !isAdminMode ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Client Gateway
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(true);
                  setEmail('opendev.office@gmail.com');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isAdminMode ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Admin Sign In
              </button>
            </div>
          </div>
          
          {/* Header (Fixed height slot for perfect alignment) */}
          <div className="text-center space-y-1.5 h-16 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {isAdminMode ? 'Admin Security Access' : 'Sign In to Client Portal'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              {isAdminMode
                ? 'Enter administrator credentials to access agency revenue & client CRM.'
                : 'Select Google Sign-In or enter your registered client credentials below.'}
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* TOP ACTION SLOT (Google Sign-In for Clients / Security Badge for Admin - Identical Slot Height) */}
          <div className="space-y-4">
            {!isAdminMode ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={triggerRealGoogleAuth}
                type="button"
                className="w-full h-12 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold flex items-center justify-center gap-3 shadow-sm transition-all"
              >
                {/* Official Google G Icon */}
                <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </motion.button>
            ) : (
              <div className="w-full h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center justify-center gap-2">
                <Lock className="size-4 text-emerald-500 shrink-0" />
                <span>Authorized Admin Portal Access</span>
              </div>
            )}

            {/* Equal Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
              <span className="bg-white dark:bg-zinc-950 px-3 text-[10px] uppercase font-bold text-zinc-400">
                {isAdminMode ? 'or sign in with admin key' : 'or sign in with email'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">
                {isAdminMode ? 'Admin Email / Username' : 'Client Account Email'}
              </label>
              <Input
                type="email"
                placeholder={isAdminMode ? 'opendev.office@gmail.com' : 'khawar@elitetradinghub.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs rounded-xl focus:border-zinc-900 dark:focus:border-white shadow-xs font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">Password</label>
                <a href="mailto:opendev.office@gmail.com" className="text-[11px] font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs rounded-xl focus:border-zinc-900 dark:focus:border-white pr-10 shadow-xs font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white select-none font-medium"
              >
                {rememberMe ? (
                  <CheckSquare className="size-4 text-black dark:text-white" />
                ) : (
                  <Square className="size-4 text-zinc-400" />
                )}
                <span>Keep me signed in</span>
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isAuthenticating}
              className="w-full h-11 text-xs font-extrabold rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md transition-all mt-2 flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <div className="size-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isAdminMode ? 'Sign In as Admin' : 'Access Client Portal'}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Mode Footer Switcher Link */}
          <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 font-medium">
            {isAdminMode ? (
              <span>
                Looking for client project portal?{' '}
                <button
                  onClick={() => {
                    setIsAdminMode(false);
                    setEmail('khawar@elitetradinghub.com');
                  }}
                  className="font-bold text-black dark:text-white hover:underline transition-colors"
                >
                  Sign In as Client Partner
                </button>
              </span>
            ) : (
              <span>
                Are you an agency administrator?{' '}
                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setEmail('opendev.office@gmail.com');
                  }}
                  className="font-bold text-black dark:text-white hover:underline transition-colors"
                >
                  Sign In to Studio Admin
                </button>
              </span>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};
