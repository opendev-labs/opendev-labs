import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ShieldAlert, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { RunwayPricing } from '../components/pricing/RunwayPricing';
import { Live2DWavesCanvas } from '../components/ui/Live2DWavesCanvas';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

import { TypewriterHeading } from '../components/ui/TypewriterHeading';

const pricingPhrases = [
  "Choose the Perfect Plan for Your Business",
  "Transparent Development Engagement Models",
  "One-Time Codebase Handover with Full Source Code",
  "Monthly Retainer Models Starting at ₹3,000–₹4,000/mo",
  "Daily Automated Database Backups & Uptime Monitoring",
  "No Hidden Fees or Surprise Operational Costs"
];

export const PricingStandalonePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-900 relative transition-colors duration-200">
      
      {/* Top Navbar with Top-Right Dark Mode Toggle */}
      <Navbar />

      {/* Hero Header - Screen-fit height with typing animated heading */}
      <section className="relative min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <Live2DWavesCanvas className="absolute inset-0 pointer-events-none opacity-50 z-0" waveCount={4} verticalBaseStart={0.35} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center my-auto w-full">
          <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 sm:mb-6 shadow-xs">
            Simple, Transparent Web & Automation Plans
          </span>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.06] min-h-[140px] sm:min-h-[180px] flex items-center justify-center">
            <TypewriterHeading phrases={pricingPhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            From one-time custom handovers to continuous monthly retainers starting at ₹3,000–₹4,000/mo. Zero hidden setup fees.
          </p>
        </div>
      </section>

      {/* Main Runway Pricing Component */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
        <RunwayPricing />

        {/* Retainer Model Highlight */}
        <div className="mt-16 rounded-3xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider mb-4">
              Flagship Model
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Why 85% of Clients Choose the ₹3,000–₹4,000/mo Retainer
            </h3>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Never worry about server crashes, missing database backups, or outdated security dependencies again. Our retainers include automated daily backups, 24/7 uptime monitoring, and priority developer availability for continuous maintenance.
            </p>
            
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-11 px-6 rounded-xl"
              >
                Start Monthly Retainer →
              </Button>
              <a
                href="/iamyashramteke/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Inspect Yash Ramteke Portfolio <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
