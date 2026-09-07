import React from 'react';
import { motion } from 'framer-motion';
import { Key, ShieldCheck } from 'lucide-react';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const ClientCredentialsPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md">
              Secure Key Vault
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Vault Credentials & Webhook Integration
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
            Access live webhook receiver endpoints, Razorpay automated keys, and SMTP relay details.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Key className="size-5 text-amber-500" /> Webhook Endpoints & API Integration
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 font-mono text-[10px] font-extrabold uppercase">
                🔒 AES-256 Protected
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Live Webhook Receiver Endpoint</span>
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white flex items-center justify-between">
                  <span className="truncate">https://api.opendev-labs.com/v1/webhooks/client-active</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-extrabold">Active</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Razorpay Automated Payment Key</span>
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white flex items-center justify-between">
                  <span className="truncate">rzp_live_opendev_vltmpl_****9481</span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-extrabold">VLTMPL Linked</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Dedicated SMTP Mail Relay</span>
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white flex items-center justify-between">
                  <span className="truncate">smtp.opendev-labs.com:587 (TLS Enabled)</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-extrabold">Connected</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" /> Full IP & Vault Guarantee
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              You maintain 100% intellectual property ownership. Your source code, API keys, and environment variables are strictly managed under OpenDev-Labs security standards.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
