import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * opendev-labs.com/openstudio
 * Landing page for OpenStudio AI Builder.
 * - If logged in → shows dashboard with launch button
 * - If not logged in → CTA to sign in, or try without login
 */
const OpenStudioLandingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden relative">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00f2fe]/5 blur-[120px] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-zinc-800/60">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/favicon.png" alt="OpenDev-Labs" className="w-7 h-7 rounded-lg" />
          <span className="text-sm font-semibold text-zinc-300">OpenDev-Labs</span>
          <span className="text-zinc-600 mx-1">/</span>
          <span className="text-sm font-bold text-white">OpenStudio</span>
        </a>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">{user.email}</span>
              <a
                href="https://openstudio.opendev-labs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Launch Studio →
              </a>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-1.5 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium rounded-lg hover:border-zinc-500 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
          Powered by Gemini · Claude · GPT-4
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white max-w-4xl leading-none mb-6">
          Build Full-Stack Apps
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#7928ca]">
            From a Single Prompt
          </span>
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl leading-relaxed mb-10">
          OpenStudio is your AI co-pilot for building React, Vanilla, and Python applications — with live preview, code editing, and one-click deployment.
        </p>

        {user ? (
          <div className="flex items-center gap-4">
            <a
              href="https://openstudio.opendev-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] active:scale-95"
            >
              Open Studio →
            </a>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3.5 border border-zinc-700 text-zinc-300 hover:text-white text-sm font-medium rounded-xl hover:border-zinc-500 transition-colors"
            >
              My Dashboard
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/auth?redirect=/openstudio')}
              className="px-8 py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] active:scale-95"
            >
              Get Started Free →
            </button>
            <a
              href="https://openstudio.opendev-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 border border-zinc-700 text-zinc-300 hover:text-white text-sm font-medium rounded-xl hover:border-zinc-500 transition-colors"
            >
              Try Without Login
            </a>
          </div>
        )}
      </div>

      {/* FEATURES GRID */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: '⚡', title: 'Instant Generation', desc: 'Full-stack apps from a single natural language prompt in seconds' },
          { icon: '🔴', title: 'Live Preview', desc: 'See your app running live as AI writes the code, side by side' },
          { icon: '🧠', title: 'Multi-Model AI', desc: 'Gemini 2.0, Claude Sonnet, GPT-4, and local models via WebLLM' },
          { icon: '📁', title: 'File Tree & Editor', desc: 'Monaco-powered code editor with full file system management' },
          { icon: '🚀', title: 'One-Click Deploy', desc: 'Deploy to Vercel, Netlify, or GitHub directly from the studio' },
          { icon: '🔐', title: 'Shared Auth', desc: 'One account across all OpenDev-Labs products' },
        ].map((f) => (
          <div key={f.title} className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
            <span className="text-2xl mb-3 block">{f.icon}</span>
            <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="relative z-10 border-t border-zinc-800/60 py-6 px-8 flex items-center justify-between">
        <p className="text-xs text-zinc-600">© 2026 OpenDev-Labs · Built by Yash Ramteke</p>
        <a href="https://openstudio.opendev-labs.com" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-white transition-colors">
          openstudio.opendev-labs.com ↗
        </a>
      </div>
    </div>
  );
};

export default OpenStudioLandingPage;
