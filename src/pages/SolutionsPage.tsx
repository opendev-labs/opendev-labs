import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sliders,
  Server,
  Layers,
  Database,
  Lock,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Live2DWavesCanvas } from '../components/ui/Live2DWavesCanvas';
import { useNavigate } from 'react-router-dom';

import { TypewriterHeading } from '../components/ui/TypewriterHeading';

const heroPhrases = [
  "Engineering Models Tailored to Your Business Growth",
  "High-Performance Web Applications Built for Scale",
  "Full-Stack Codebase Handover with Complete IP Ownership",
  "Monthly Retainers with 24/7 Automated Backups & Monitoring",
  "Custom Enterprise Portals & Daily Bash Automation Scripts",
  "Production-Grade Architecture Delivered on Your Schedule"
];

export const SolutionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<'handover' | 'retainer'>('retainer');
  
  // Calculator states
  const [appType, setAppType] = useState<'landing' | 'fullstack' | 'automation'>('fullstack');
  const [needRetainer, setNeedRetainer] = useState(true);
  const [databaseBackup, setDatabaseBackup] = useState(true);

  const calculateEstimate = () => {
    let base = 0;
    if (appType === 'landing') base = 12000;
    if (appType === 'fullstack') base = 35000;
    if (appType === 'automation') base = 25000;

    let monthly = needRetainer ? (appType === 'landing' ? 3000 : 4000) : 0;
    if (databaseBackup && needRetainer) monthly += 500;

    return { base, monthly };
  };

  const estimate = calculateEstimate();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <Navbar />

      {/* Hero Banner - Screen-fit height with typing animated heading */}
      <section className="relative min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <Live2DWavesCanvas className="absolute inset-0 pointer-events-none opacity-80 z-0" waveCount={5} verticalBaseStart={0.35} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center my-auto w-full">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 sm:mb-6 shadow-xs">
              <Zap className="size-3.5" /> High-Performance Software Engineering & Automation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.06] text-zinc-900 dark:text-white min-h-[140px] sm:min-h-[180px] flex items-center justify-center"
          >
            <TypewriterHeading phrases={heroPhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Choose between a <span className="font-extrabold text-zinc-900 dark:text-white">One-Time Handover Build</span> or our flagship <span className="font-extrabold text-zinc-900 dark:text-white">Monthly Retainer (₹3,000–₹4,000/mo)</span> for automated backups, 24/7 server health monitoring, and daily bash automation scripts.
          </motion.p>
        </div>
      </section>

      {/* Model Selection Tabs */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Choose Your Development Engagement
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm">
            Transparent pricing with zero hidden fees. Pick the model that fits your operational needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Option A: One-Time Handover */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-8 flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-sm">
            <div>
              <div className="size-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Code2 className="size-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                One-Time Handover Build
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Full-stack custom development delivered with clean source code, setup scripts, and complete IP ownership. Ideal for self-hosted products.
              </p>
              
              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  100% Source Code & Git Repository Ownership
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Automated Deployment & Build Scripts
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  30 Days Post-Launch Bug Warranty
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Production Security Hardening
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                onClick={() => navigate('/pricing')}
                className="w-full h-11 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold rounded-xl"
              >
                Get One-Time Quote →
              </Button>
            </div>
          </div>

          {/* Option B: Monthly Retainer (Recommended) */}
          <div className="rounded-2xl border-2 border-blue-600 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 p-8 flex flex-col justify-between relative shadow-lg">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md">
                <RefreshCw className="size-6 animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                Monthly Retainer <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">₹3,000–₹4,000/mo</span>
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Continuous maintenance, daily automated backups, zero-downtime server updates, and priority developer support.
              </p>

              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                  Automated Daily Database & File Backups
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                  24/7 System Health & Uptime Monitoring
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                  Continuous Security Patches & SSL Renewals
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                  Monthly Feature Allocation (5-10 hrs)
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                onClick={() => navigate('/pricing')}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md"
              >
                Subscribe to Retainer →
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Estimator Calculator */}
      <section className="py-16 px-4 sm:px-6 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">
              Interactive Estimator
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Instant Solution Cost Calculator
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Select your requirements below to see an instant estimate.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-sm">
            <div className="space-y-6">
              
              {/* App Type */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3">
                  Project Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setAppType('landing')}
                    className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      appType === 'landing'
                        ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                    }`}
                  >
                    High-Converting Landing
                    <span className="block text-[11px] font-normal text-zinc-500 mt-1">Est. ₹12,000</span>
                  </button>

                  <button
                    onClick={() => setAppType('fullstack')}
                    className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      appType === 'fullstack'
                        ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                    }`}
                  >
                    Full-Stack Web App
                    <span className="block text-[11px] font-normal text-zinc-500 mt-1">Est. ₹35,000</span>
                  </button>

                  <button
                    onClick={() => setAppType('automation')}
                    className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      appType === 'automation'
                        ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                    }`}
                  >
                    Bash & Cloud Automation
                    <span className="block text-[11px] font-normal text-zinc-500 mt-1">Est. ₹25,000</span>
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">Include Monthly Maintenance & Monitoring</span>
                    <span className="text-[11px] text-zinc-500">24/7 uptime monitoring & security patches (₹3,000–₹4,000/mo)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={needRetainer}
                    onChange={(e) => setNeedRetainer(e.target.checked)}
                    className="size-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">Automated Daily Cloud Backups</span>
                    <span className="text-[11px] text-zinc-500">Automated PostgreSQL/MySQL & media snapshots (+₹500/mo)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={databaseBackup}
                    onChange={(e) => setDatabaseBackup(e.target.checked)}
                    className="size-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Result Summary */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl gap-4">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block font-semibold">Estimated Cost Breakdown</span>
                  <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                    ₹{estimate.base.toLocaleString()} <span className="text-xs font-normal text-zinc-500">one-time</span>
                    {estimate.monthly > 0 && (
                      <span className="text-blue-600 dark:text-blue-400 text-lg font-bold ml-2">
                        + ₹{estimate.monthly.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/pricing')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-11 px-6 rounded-xl w-full sm:w-auto"
                >
                  Confirm Quote →
                </Button>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
