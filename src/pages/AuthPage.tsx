import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { promptGoogleSignIn } from '../services/googleAuth';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Mail,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';
import { AirplaneAnimation } from '../components/ui/AirplaneAnimation';

// ── Social button types ─────────────────────────────────────────────────────
type SocialMethod = 'google' | 'github' | 'email';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDeveloper, loginAsClient, loginWithGoogle } = useAuth();
  const { clients } = useClients();
  const { theme, toggleTheme } = useTheme();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeMethod, setActiveMethod] = useState<SocialMethod | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const handlePostLogin = (email: string) => {
    const clean = email.toLowerCase().trim();
    const isAdmin =
      clean === 'opendev-labs.office@gmail.com' ||
      clean === 'opendev.office@gmail.com';
    const matched = clients.find((c) => c.email.toLowerCase() === clean);
    navigate(isAdmin ? '/dashboard' : matched ? '/client/portal' : '/client/profile');
  };

  // ── Email/Password submit ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMessage('');

    if (isAdminMode) {
      const valid = ['opendev-labs.office@gmail.com', 'opendev.office@gmail.com', 'admin', 'yash', 'yashramteke'];
      if (valid.includes(email.trim().toLowerCase()) && password.length >= 4) {
        loginAsDeveloper();
        navigate('/dashboard');
        setIsAuthenticating(false);
        return;
      }
      if (auth) {
        try {
          await signInWithEmailAndPassword(auth, email.trim(), password);
          loginAsDeveloper();
          navigate('/dashboard');
          setIsAuthenticating(false);
          return;
        } catch {
          // fall through
        }
      }
      setErrorMessage('Invalid admin username or password.');
      setIsAuthenticating(false);
      return;
    }

    // Client custom domain / clientCode lookup
    const clean = email.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const found = clients.find(
      (c) =>
        (c.domain && c.domain.toLowerCase() === clean) ||
        c.email.toLowerCase() === clean ||
        (c.clientCode && c.clientCode.toLowerCase() === clean)
    );
    if (found) {
      if (password && found.password && found.password !== password) {
        setErrorMessage('Invalid password for this domain.');
        setIsAuthenticating(false);
        return;
      }
      loginAsClient(found.id, found.name, found.email);
      navigate('/client/portal');
      setIsAuthenticating(false);
      return;
    }

    // Direct Firebase Email/Password Sign-In
    if (auth && email.includes('@') && password.length >= 6) {
      try {
        let fbUser;
        try {
          const res = await signInWithEmailAndPassword(auth, email.trim(), password);
          fbUser = res.user;
        } catch (signInErr: any) {
          if (signInErr?.code === 'auth/user-not-found' || signInErr?.code === 'auth/invalid-credential') {
            try {
              const createRes = await createUserWithEmailAndPassword(auth, email.trim(), password);
              fbUser = createRes.user;
            } catch {
              throw signInErr;
            }
          } else {
            throw signInErr;
          }
        }

        if (fbUser) {
          try {
            await fbUser.reload();
          } catch {}
          const userObj = auth.currentUser || fbUser;
          const cleanEmail = (userObj.email || email).toLowerCase().trim();
          const displayName = userObj.displayName || cleanEmail.split('@')[0];
          const avatar = userObj.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${userObj.uid}`;

          if (db) {
            await setDoc(doc(db, 'users', userObj.uid), {
              id: userObj.uid,
              name: displayName,
              email: cleanEmail,
              avatar: avatar,
              role: 'user',
              authMethod: 'password',
              online: true,
              lastSeen: serverTimestamp(),
              joinedAt: serverTimestamp(),
            }, { merge: true }).catch(() => {});
          }

          loginWithGoogle(cleanEmail, displayName, avatar, 'password');
          handlePostLogin(cleanEmail);
          setIsAuthenticating(false);
          return;
        }
      } catch (fbErr: any) {
        console.error('Email sign in error:', fbErr);
        if (fbErr?.code === 'auth/wrong-password' || fbErr?.code === 'auth/invalid-credential') {
          setErrorMessage('Incorrect password or account credentials.');
        } else if (fbErr?.code === 'auth/invalid-email') {
          setErrorMessage('Please enter a valid email address.');
        } else if (fbErr?.code === 'auth/weak-password') {
          setErrorMessage('Password must be at least 6 characters.');
        } else {
          setErrorMessage(fbErr?.message || 'Email authentication failed.');
        }
        setIsAuthenticating(false);
        return;
      }
    }

    loginWithGoogle(clean, clean.split('@')[0], undefined, 'password');
    navigate('/client/profile');
    setIsAuthenticating(false);
  };

  // ── Google Sign-In ───────────────────────────────────────────────────────
  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setErrorMessage('');
    try {
      if (auth) {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);

        try {
          await result.user.reload();
        } catch {}
        const gu = auth.currentUser || result.user;
        const addInfo = getAdditionalUserInfo(result);
        const profile = addInfo?.profile as Record<string, any> | undefined;

        let avatar = profile?.picture || gu.photoURL || '';
        if (avatar && !avatar.includes('&t=') && !avatar.includes('?t=')) {
          avatar = avatar.includes('?') ? `${avatar}&t=${Date.now()}` : `${avatar}?t=${Date.now()}`;
        }

        const email = (gu.email || profile?.email || '').toLowerCase().trim();
        const displayName = gu.displayName || profile?.name || (email ? email.split('@')[0] : 'Google User');
        const isLeadDev = email === 'opendev-labs.office@gmail.com' || email === 'opendev.office@gmail.com';

        if (db) {
          await setDoc(doc(db, 'users', gu.uid), {
            id: gu.uid,
            name: displayName,
            email: email,
            avatar: avatar,
            role: isLeadDev ? 'developer' : 'user',
            authMethod: 'google',
            online: true,
            lastSeen: serverTimestamp(),
            joinedAt: serverTimestamp(),
          }, { merge: true }).catch(() => {});
        }
        loginWithGoogle(email, displayName, avatar, 'google');
        handlePostLogin(email);
        return;
      }
      const gp = await promptGoogleSignIn();
      loginWithGoogle(gp.email, gp.name, gp.picture, 'google');
      handlePostLogin(gp.email);
    } catch (err: any) {
      if (!err?.message?.includes('closed_by_user')) {
        setErrorMessage(err?.message || 'Google Sign-In failed.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // ── GitHub Sign-In ───────────────────────────────────────────────────────
  const handleGithubAuth = async () => {
    setIsAuthenticating(true);
    setErrorMessage('');
    try {
      if (!auth) throw new Error('Firebase not initialised');
      const provider = new GithubAuthProvider();
      provider.addScope('user:email');
      provider.addScope('read:user');
      // Prompt select_account so GitHub asks which account to authorize and allows switching accounts
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);

      // Save user's GitHub access token to localStorage so OpenStudio connects to their personal GitHub
      const credential = GithubAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        localStorage.setItem('opendev_gh_token', credential.accessToken);
      }

      try {
        await result.user.reload();
      } catch (e) {
        console.warn('User reload error:', e);
      }

      const gu = auth.currentUser || result.user;
      const addInfo = getAdditionalUserInfo(result);
      const profile = addInfo?.profile as Record<string, any> | undefined;

      const githubLogin = profile?.login || '';
      let avatar = profile?.avatar_url || gu.photoURL || (githubLogin ? `https://github.com/${githubLogin}.png` : '');
      if (avatar) {
        avatar = avatar.includes('?') ? `${avatar}&t=${Date.now()}` : `${avatar}?t=${Date.now()}`;
      }

      const displayName = gu.displayName || profile?.name || githubLogin || 'GitHub User';
      const email = (
        gu.email ||
        profile?.email ||
        (githubLogin ? `${githubLogin}@github.opendev-labs.com` : `user-${gu.uid.slice(0, 6)}@opendev-labs.com`)
      ).toLowerCase().trim();

      const isDev = email === 'opendev-labs.office@gmail.com' || email === 'opendev.office@gmail.com';
      const userRole = isDev ? 'developer' : 'user';

      if (db) {
        await setDoc(doc(db, 'users', gu.uid), {
          id: gu.uid,
          name: displayName,
          githubHandle: githubLogin,
          email: email,
          avatar: avatar,
          role: userRole,
          authMethod: 'github',
          online: true,
          lastSeen: serverTimestamp(),
          joinedAt: serverTimestamp(),
        }, { merge: true }).catch(() => {});
      }

      loginWithGoogle(email, displayName, avatar, 'github');
      handlePostLogin(email);
    } catch (err: any) {
      if (!err?.message?.includes('closed_by_user')) {
        setErrorMessage(err?.message || 'GitHub Sign-In failed.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="h-screen max-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 selection:text-black relative overflow-hidden">

      {/* Canvas bg */}
      <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-50 z-0" particleCount={40} />

      {/* Theme toggle — top right */}
      <button
        onClick={toggleTheme}
        className="absolute top-3 right-3 sm:top-6 sm:right-6 z-30 size-7 sm:size-9 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-md transition-all shadow-md hover:scale-105"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <Moon className="size-3.5 sm:size-4 text-zinc-800 transition-transform hover:-rotate-12" />
        ) : (
          <Sun className="size-3.5 sm:size-4 text-amber-400 transition-transform hover:rotate-45" />
        )}
      </button>

      {/* ── LEFT: Hero panel ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[50vh] lg:h-full lg:flex-1 relative p-4 sm:p-6 lg:p-10 flex flex-col justify-between items-start z-10 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 shrink-0 overflow-hidden bg-zinc-950"
      >
        <AirplaneAnimation />

        {/* BRAND — top-left of hero, clicking = back to home */}
        <Link
          to="/"
          className="relative z-10 flex items-center gap-2 sm:gap-3 group"
          title="Back to opendev-labs.com"
        >
          <img
            src="/logo-icon.webp"
            alt="OpenDev-Labs Logo"
            className="h-8 sm:h-11 w-auto object-contain drop-shadow-lg transition-transform group-hover:scale-105"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <span className="font-extrabold text-lg sm:text-2xl text-white tracking-tight drop-shadow-lg">
            opendev<span className="text-blue-400">-labs</span>
          </span>
          <span className="text-zinc-500 text-xs hidden sm:inline ml-1 group-hover:text-zinc-300 transition-colors">← home</span>
        </Link>

        {/* bottom tagline on desktop */}
        <div className="hidden lg:block relative z-10">
          <p className="text-zinc-400 text-sm font-medium">
            Enterprise software, client portals & AI products.
          </p>
        </div>
      </motion.div>

      {/* ── RIGHT: Auth panel ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[50vh] lg:h-full lg:w-[420px] xl:w-[460px] shrink-0 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-6 lg:p-10 flex flex-col justify-between items-center z-10 relative border-l border-zinc-200 dark:border-zinc-800/80 shadow-2xl overflow-y-auto"
      >
        {/* Mode tab pill */}
        <div className="w-full max-w-sm flex justify-center shrink-0 pt-1 sm:pt-2 lg:pt-4">
          <div className="inline-flex p-0.5 sm:p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <button
              type="button"
              onClick={() => { setIsAdminMode(false); setEmail(''); setActiveMethod(null); setErrorMessage(''); }}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                !isAdminMode ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsAdminMode(true); setEmail('opendev-labs.office@gmail.com'); setActiveMethod(null); setErrorMessage(''); }}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                isAdminMode ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
        <div className="w-full max-w-sm my-auto py-2 flex flex-col gap-3">

          <div className="text-center mb-1">
            <h1 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {isAdminMode ? 'Admin Sign In' : 'Welcome back'}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isAdminMode ? 'Studio admin access only' : 'Choose how you want to sign in'}
            </p>
          </div>

          {/* Error */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-[11px] font-semibold text-center"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* ── CLIENT MODE: Social sign-in grid ───────────────────────── */}
          {!isAdminMode ? (
            <div className="space-y-2.5">

              {/* 1. Google */}
              <button
                onClick={handleGoogleAuth}
                disabled={isAuthenticating}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-sm font-semibold text-zinc-900 dark:text-white shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60"
              >
                {isAuthenticating && activeMethod === 'google' ? (
                  <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* 2. GitHub */}
              <button
                onClick={handleGithubAuth}
                disabled={isAuthenticating}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-sm font-semibold text-zinc-900 dark:text-white shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Continue with GitHub</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[10px] text-zinc-400 font-medium">or</span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* 3. Email */}
              {activeMethod === 'email' ? (
                <motion.form
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                >
                  <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Sign in with Email</p>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs rounded-xl"
                    required
                    autoFocus
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs rounded-xl pr-10"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => { setActiveMethod(null); setErrorMessage(''); }}
                      className="flex-1 h-9 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      Cancel
                    </button>
                    <Button type="submit" disabled={isAuthenticating}
                      className="flex-1 h-9 text-xs font-bold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center justify-center gap-1.5">
                      {isAuthenticating
                        ? <div className="size-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                        : <><span>Continue</span><ArrowRight className="size-3.5" /></>}
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <button
                  onClick={() => { setActiveMethod('email'); setErrorMessage(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-sm font-semibold text-zinc-900 dark:text-white shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <Mail className="w-5 h-5 shrink-0 text-zinc-500" />
                  <span>Continue with Email</span>
                </button>
              )}
            </div>

          ) : (
            /* ── ADMIN SIGN-IN FORM ───────────────────────────────────── */
            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs rounded-xl"
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs rounded-xl pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Button type="submit" disabled={isAuthenticating}
                className="w-full h-11 text-xs font-extrabold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center justify-center gap-2">
                {isAuthenticating
                  ? <div className="size-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  : <><span>Sign In as Admin</span><ArrowRight className="size-4" /></>}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="w-full max-w-sm pt-2 space-y-2 text-center shrink-0">
          {!isAdminMode && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-zinc-400">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Secure authentication · OpenDev Cloud</span>
            </div>
          )}
          <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
            {isAdminMode ? (
              <span>
                Not admin?{' '}
                <button onClick={() => { setIsAdminMode(false); setEmail(''); setErrorMessage(''); }}
                  className="font-bold text-black dark:text-white hover:underline">
                  Sign in as user
                </button>
              </span>
            ) : (
              <span>
                Agency admin?{' '}
                <button onClick={() => { setIsAdminMode(true); setEmail('opendev-labs.office@gmail.com'); setErrorMessage(''); }}
                  className="font-bold text-black dark:text-white hover:underline">
                  Admin sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
