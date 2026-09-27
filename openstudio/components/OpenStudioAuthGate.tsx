import React, { useEffect, useState } from 'react';
import { getSessionUser, getAuthRedirectUrl } from '../lib/authSession';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface OpenStudioAuthGateProps {
  children: React.ReactNode;
}

/**
 * Sovereign Authentication Gate for openstudio.opendev-labs.com
 * Enforces that OpenStudio can ONLY be accessed by authenticated users
 * logged in via opendev-labs.com.
 * Unauthenticated users are blocked and immediately redirected to opendev-labs.com/auth
 */
export const OpenStudioAuthGate: React.FC<OpenStudioAuthGateProps> = ({ children }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // 1. Immediate Check: Check URL handoff token, cookie, or local storage
    const session = getSessionUser();
    if (session && session.id) {
      setHasAccess(true);
      setIsVerifying(false);
      return;
    }

    // 2. Secondary Check: Listen for Firebase Auth onAuthStateChanged
    if (auth) {
      let isResolved = false;
      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
        if (isResolved) return;
        isResolved = true;

        if (firebaseUser) {
          setHasAccess(true);
          setIsVerifying(false);
        } else {
          // Re-verify session in case handoff token was parsed concurrently
          const latestSession = getSessionUser();
          if (latestSession && latestSession.id) {
            setHasAccess(true);
            setIsVerifying(false);
          } else {
            // Unauthenticated: Block and redirect immediately
            setHasAccess(false);
            setIsVerifying(false);
            const redirectUrl = getAuthRedirectUrl();
            window.location.replace(redirectUrl);
          }
        }
      });

      // Safety timeout: If Firebase auth hangs for >1500ms and no session exists, redirect
      const timeout = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          const fallbackSession = getSessionUser();
          if (fallbackSession && fallbackSession.id) {
            setHasAccess(true);
            setIsVerifying(false);
          } else {
            setHasAccess(false);
            setIsVerifying(false);
            window.location.replace(getAuthRedirectUrl());
          }
        }
      }, 1500);

      return () => {
        unsub();
        clearTimeout(timeout);
      };
    } else {
      // No Firebase auth and no session
      setHasAccess(false);
      setIsVerifying(false);
      window.location.replace(getAuthRedirectUrl());
    }
  }, []);

  if (isVerifying) {
    return (
      <div className="w-full h-screen bg-[#09090b] flex flex-col items-center justify-center text-white font-sans selection:bg-blue-500">
        <div className="flex flex-col items-center gap-4">
          <div className="relative size-14 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-2xl">
            <span className="size-3.5 rounded-full bg-cyan-400 animate-ping absolute" />
            <span className="size-3.5 rounded-full bg-cyan-400" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold tracking-tight text-white">OpenStudio Sovereign Gateway</h3>
            <p className="text-xs text-zinc-400">Verifying session with opendev-labs.com...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    const redirectUrl = getAuthRedirectUrl();
    return (
      <div className="w-full h-screen bg-[#09090b] flex flex-col items-center justify-center text-white font-sans p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-5">
          <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-xl font-bold">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Authentication Required</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              OpenStudio is exclusively accessible to verified members logged in via <strong>opendev-labs.com</strong>.
            </p>
          </div>
          <a
            href={redirectUrl}
            className="w-full py-2.5 px-5 rounded-full bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            Sign In with OpenDev Account →
          </a>
          <p className="text-[11px] text-zinc-500">
            Redirecting to sovereign authentication gateway...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
