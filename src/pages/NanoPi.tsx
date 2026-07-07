import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../features/void/hooks/useAuth';

export default function NanoPi() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Minimum load time effect
    const minLoadTime = 1500;
    const startTime = Date.now();

    const checkLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);
      setTimeout(() => {
        setLoaded(true);
      }, remaining);
    };

    // Fallback if iframe doesn't trigger onload
    const fallbackTimer = setTimeout(() => {
      if (!loaded) checkLoad();
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [loaded]);

  const handleIframeLoad = () => {
    setLoaded(true);
  };

  const openLoginPopup = () => {
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      'https://opendev-labs-nanopi.hf.space/',
      'NanoPi Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const reloadFrame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-background text-foreground overflow-hidden font-sans">
      {/* Loading Screen */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-background transition-all duration-700 ease-out ${
          loaded ? 'opacity-0 invisible' : 'opacity-100 visible'
        }`}
      >
        <div className="w-20 h-20 mb-8 rounded-full border-2 border-primary animate-pulse flex items-center justify-center drop-shadow-[0_0_20px_rgba(0,0,0,0.1)]">
          <span className="text-primary font-bold text-xl">π</span>
        </div>
        <div className="w-[200px] h-[2px] bg-muted rounded overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-[loading_1.5s_infinite]" />
        </div>
        <div className="mt-4 text-xs tracking-[2px] uppercase text-muted-foreground font-medium">
          {loaded ? 'Uplink Established' : 'Initializing Neural Link...'}
        </div>
      </div>

      {/* Auth Helper Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex gap-2">
        <button
          onClick={openLoginPopup}
          className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-md border border-border text-muted-foreground rounded-lg text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <span>👤</span> Connect Account
        </button>
        <button
          onClick={reloadFrame}
          title="Reload Chat"
          className="flex items-center justify-center px-3 py-2 bg-background/60 backdrop-blur-md border border-border text-muted-foreground rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <span>↻</span>
        </button>
      </div>

      {/* Iframe Container */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <iframe
          ref={iframeRef}
          src="https://opendev-labs-nanopi.hf.space"
          className="w-full h-full border-none block"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; microphone; clipboard-read; clipboard-write"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
