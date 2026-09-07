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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        const cleanEmail = email.trim().toLowerCase();
        const foundClient = clients.find(
          c => c.email.toLowerCase() === cleanEmail ||
               c.name.toLowerCase().includes(cleanEmail)
        );
        if (foundClient) {
          loginAsClient(foundClient.id);
        } else {
          loginWithGoogle(cleanEmail, cleanEmail.split('@')[0]);
        }
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
          googleUser.email || undefined,
          googleUser.displayName || undefined,
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 selection:text-black relative overflow-hidden">
      
      {/* 2D Live Canvas Background */}
      <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-50 z-0" particleCount={40} />

      {/* TOP LEFT CORNER: Back to Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all shadow-md hover:scale-105"
      >
        ← Back to Home
      </Link>

      {/* TOP RIGHT CORNER: Dark Mode Icon Switch */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 size-8 sm:size-9 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-md transition-all shadow-md hover:scale-105"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <Moon className="size-4 text-zinc-800 transition-transform hover:-rotate-12" />
        ) : (
          <Sun className="size-4 text-amber-400 transition-transform hover:rotate-45" />
        )}
      </button>

      {/* LEFT / UPPER PORTION (60% Height on Mobile, Full Height on Desktop with background image) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[60vh] lg:h-auto lg:flex-1 relative bg-[url('/digital-nomads.webp')] bg-cover bg-center p-5 sm:p-6 lg:p-10 flex flex-col justify-end items-start z-10 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 shrink-0"
      >
        {/* Company Logo at Bottom Left of Image Area */}
        <div className="z-10 flex items-center pt-8 lg:pt-0">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <img
              src="/logo-icon.webp"
              alt="OpenDev-Labs Logo"
              className="h-12 sm:h-16 w-auto object-contain drop-shadow-lg transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-extrabold text-2xl sm:text-4xl text-white tracking-tight drop-shadow-lg">
              opendev<span className="text-blue-400">-labs</span>
            </span>
          </Link>
        </div>
      </motion.div>

      {/* RIGHT / LOWER PORTION (40% Remaining Height on Mobile, Side Panel on Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full min-h-[40vh] lg:w-[400px] xl:w-[440px] shrink-0 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-5 sm:p-8 lg:p-10 flex flex-col justify-between items-center lg:min-h-screen z-10 relative border-l border-zinc-200 dark:border-zinc-800/80 shadow-2xl py-6 lg:py-12"
      >
        
        {/* Main Sign-In Content */}
        <div className="w-full max-w-sm space-y-6 my-auto">
          {/* Mode Switcher Pill */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setEmail('');
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
          
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* CLIENT GOOGLE SIGN-IN MODE (CLEAN, GOOGLE-ONLY) */}
          {!isAdminMode ? (
            <div className="space-y-3 pt-2 text-center">
              <button
                onClick={triggerRealGoogleAuth}
                disabled={isAuthenticating}
                type="button"
                className="gsi-material-button"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  {isAuthenticating ? (
                    <div className="size-4 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <div className="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                          <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents">Sign in with Google</span>
                      <span style={{ display: 'none' }}>Sign in with Google</span>
                    </>
                  )}
                </div>
              </button>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium pt-1">
                Sign in with your Google account to access your live webapp portal.
              </p>
            </div>
          ) : (
            /* ADMIN SIGN-IN FORM */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-2">
              <div className="space-y-1.5">
                <Input
                  type="email"
                  placeholder="Admin Email (opendev.office@gmail.com)"
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

              <Button
                type="submit"
                disabled={isAuthenticating}
                className="w-full h-11 text-xs font-extrabold rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md transition-all mt-2 flex items-center justify-center gap-2"
              >
                {isAuthenticating ? (
                  <div className="size-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In as Admin</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Bottom Footer Section (Positioned at bottom of right side panel) */}
        <div className="w-full max-w-sm pt-6 space-y-4 text-center">
          {!isAdminMode && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>Secure Google OAuth 2.0 Access</span>
            </div>
          )}

          <div className="text-center pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 font-medium">
            {isAdminMode ? (
              <span>
                Looking for client project portal?{' '}
                <button
                  onClick={() => {
                    setIsAdminMode(false);
                    setEmail('');
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
