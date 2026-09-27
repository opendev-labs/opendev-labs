import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Download, Globe, Server, Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { setUserPro } from '../services/promptQuotaService';
import { toast } from 'sonner';

interface OpenStudioProModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'export' | 'quota' | 'general';
}

export function OpenStudioProModal({ isOpen, onClose, reason = 'general' }: OpenStudioProModalProps) {
  if (!isOpen) return null;

  const handleActivateDemoPro = () => {
    setUserPro(true);
    toast.success('🎉 OpenStudio Pro unlocked successfully!');
    onClose();
  };

  const reasonTitle = 
    reason === 'export' ? 'Code & ZIP Export is an OpenStudio Pro Feature' :
    reason === 'quota' ? 'Daily Prompt Limit Reached (6/6 Free Prompts)' :
    'Upgrade to OpenStudio Pro';

  const reasonSubtitle = 
    reason === 'export' ? 'Unlock complete production ZIP downloads, full source code exports, and direct GitHub pushes.' :
    reason === 'quota' ? 'You have used all 6 free prompts for today. Free quota resets tomorrow at midnight, or unlock unlimited instantly.' :
    'Supercharge your AI development workflow with zero limitations.';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-2xl bg-[#09090b] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden text-zinc-100"
        >
          {/* TOP ACCENT GLOW */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
          
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* BADGE & ICON */}
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                OpenStudio Pro
              </span>
              <span className="text-[11px] font-semibold text-zinc-400">Enterprise AI Engine</span>
            </div>

            {/* HEADLINE */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 font-sans">
              {reasonTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
              {reasonSubtitle}
            </p>

            {/* PERKS LIST */}
            <div className="space-y-3 mb-6 bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Unlimited Daily Prompts</h4>
                  <p className="text-[11px] text-zinc-400">Never wait for the 6 prompt daily reset. Generate, iterate, and refine without caps.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Full Code & Production ZIP Export</h4>
                  <p className="text-[11px] text-zinc-400">Download clean, modular React TSX + Tailwind Vite source code ready to run locally.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Direct Publishing to opendev-labs.com/templates</h4>
                  <p className="text-[11px] text-zinc-400">Publish your web applications directly to the public showcase and your OpenStudio profile.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">High-Speed CodeDevBox Cloud VM</h4>
                  <p className="text-[11px] text-zinc-400">Blazing fast serverless compile times with dedicated high-concurrency cloud sandbox instances.</p>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="/pricing"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Upgrade to Pro Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleActivateDemoPro}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors border border-zinc-700"
                title="Activate Pro locally on this device"
              >
                Activate Pro
              </button>
            </div>

            <p className="text-center text-[10px] text-zinc-500 mt-4">
              🔒 Instant activation • Cancel anytime • 100% money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
