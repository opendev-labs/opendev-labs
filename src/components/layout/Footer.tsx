import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Mail, ExternalLink, Github, Code2, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 py-16 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-icon.webp" alt="Logo" className="h-12 sm:h-14 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            <span className="font-extrabold text-2xl text-zinc-900 dark:text-white">
              opendev<span className="text-blue-600 dark:text-blue-400">-labs</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed max-w-sm text-zinc-600 dark:text-zinc-400">
            High-performance web application engineering, Bash automation pipelines, and automated retainer management. Trusted by startups and enterprises worldwide.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Systems Operational (100% Uptime)
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Pages */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900 dark:text-white mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link to="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/solutions" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Software Solutions
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Plans & Retainers
              </Link>
            </li>
          </ul>
        </div>

        {/* Engineering & Bash Projects */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900 dark:text-white mb-4">
            Yash Projects
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <a href="/iamyashramteke/case-study/agentbash/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1">
                AgentBash Engine <ExternalLink className="size-3 text-zinc-400" />
              </a>
            </li>
            <li>
              <a href="/iamyashramteke/case-study/void/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1">
                Void Cloud Terminal <ExternalLink className="size-3 text-zinc-400" />
              </a>
            </li>
            <li>
              <a href="/iamyashramteke/case-study/quantum-compute/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1">
                Quantum Compute <ExternalLink className="size-3 text-zinc-400" />
              </a>
            </li>
            <li>
              <a href="/iamyashramteke/case-study/gh-sync-desk/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1">
                GH-Sync-Desk <ExternalLink className="size-3 text-zinc-400" />
              </a>
            </li>
            <li>
              <a href="/iamyashramteke/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors font-bold text-blue-600 dark:text-blue-400">
                Full Yash Portfolio →
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Legal */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900 dark:text-white mb-4">
            Client Support
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link to="/auth" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Developer Studio Portal
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Client Invoice Dashboard
              </Link>
            </li>
            <li className="pt-2 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
              Direct Contact:
              <span className="block text-zinc-800 dark:text-zinc-200 font-sans font-bold">opendev-labs@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-zinc-200 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span>© {new Date().getFullYear()} OpenDev-Labs & Yash Ramteke. All rights reserved.</span>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tracking-tight bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
            Partnered by{" "}
            <a
              href="https://www.vishwaleader.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold underline transition-colors"
            >
              VLTMPL
            </a>
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span>POSIX / Bash 5.2</span>
          <span>Linux Kernel 6.x</span>
          <span>React 18</span>
        </div>
      </div>
    </footer>
  );
};
