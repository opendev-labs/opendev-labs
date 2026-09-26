import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Github, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 py-16 px-4 sm:px-6 md:px-8 transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo-icon.webp"
              alt="OpenDev-Labs"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <span className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">
              opendev<span className="text-blue-600 dark:text-blue-400">-labs</span>
            </span>
          </Link>
          <p className="text-xs font-medium leading-relaxed max-w-sm text-zinc-600 dark:text-zinc-400">
            Enterprise Software Engineering, Production Web Application Development, and Custom AI Agent Automations.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Systems Operational • 100% Uptime
            </span>
          </div>
        </div>

        {/* Solutions & Platform Column */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
            Solutions
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link to="/solutions" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Enterprise Web Applications
              </Link>
            </li>
            <li>
              <Link to="/solutions" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Custom AI Agents & Bots
              </Link>
            </li>
            <li>
              <Link to="/solutions" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Dedicated Client Portals
              </Link>
            </li>
            <li>
              <Link to="/solutions" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Cloud & DevOps Automation
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform Column */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
            Platform
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link to="/templates" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Production Templates
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Plans & Retainers
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Developer Studio
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Client Access Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Contact Column */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
            Direct Contact
          </h4>
          <ul className="space-y-3 text-xs font-medium">
            <li>
              <a
                href="mailto:opendev.office@gmail.com"
                className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-white transition-colors group"
              >
                <Mail className="size-4 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                <span className="font-semibold truncate">opendev.office@gmail.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/918169568582"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-white transition-colors group"
              >
                <Phone className="size-4 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                <span className="font-semibold">+91 81695 68582</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/opendev-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-white transition-colors group"
              >
                <Github className="size-4 text-zinc-400 group-hover:text-purple-600 transition-colors" />
                <span className="font-semibold">github.com/opendev-labs</span>
                <ArrowUpRight className="size-3 opacity-60" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-10 mt-12 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-medium gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span>© {new Date().getFullYear()} OpenDev-Labs. All rights reserved.</span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 font-semibold">
            Partnered by{" "}
            <a
              href="https://www.vishwaleader.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors"
            >
              VTLM
            </a>
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold text-zinc-500">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Security & SLA
          </Link>
        </div>
      </div>
    </footer>
  );
};
