import React from 'react';

export default function NanoPi() {
  const launchNanoPi = () => {
    window.location.href = 'https://nanopi.opendev-labs.com';
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-background text-foreground overflow-hidden font-sans flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center max-w-md p-8 border border-border bg-card rounded-2xl shadow-xl">
        <div className="w-20 h-20 mb-6 rounded-full border-2 border-primary flex items-center justify-center bg-primary/10">
          <span className="text-primary font-bold text-3xl">π</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">NanoPi Intelligence</h1>
        <p className="text-muted-foreground mb-8">
          Your hyper-intelligent local assistant is running securely on a dedicated subdomain to support full Google authentication.
        </p>
        <button
          onClick={launchNanoPi}
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
        >
          <span>🚀</span> Launch NanoPi
        </button>
      </div>
    </div>
  );
}
