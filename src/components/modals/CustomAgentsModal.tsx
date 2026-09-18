import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, X, Zap, ShieldCheck, Activity, Terminal, ExternalLink, Sparkles, Server } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { Button } from '../ui/Button';

interface CustomAgentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CustomAgentsModal: React.FC<CustomAgentsModalProps> = ({ open, onOpenChange }) => {
  const { customAgents } = useClients();

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Cpu className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  Custom AI Agents & Connected Engines
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    Live Cluster
                  </span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Real-time neural model inference, target project routing, and accuracy metrics.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Agents List */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {customAgents.map(agent => (
              <div
                key={agent.id}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shrink-0">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                        {agent.name}
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {agent.model}
                        </span>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        <Server className="size-3.5" />
                        <span>Target Domain:</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono">
                          {agent.targetDomain}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active & Provisioned
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  {agent.description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">24h Requests</div>
                    <div className="text-sm font-extrabold text-zinc-900 dark:text-white font-mono mt-0.5">
                      {agent.requests24h.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Avg Latency</div>
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      {agent.latencyMs} ms
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Accuracy</div>
                    <div className="text-sm font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                      {agent.accuracyRate}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Last Checkpoint</div>
                    <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1 truncate">
                      {agent.lastTrained}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Cluster Host: <code className="font-mono text-zinc-700 dark:text-zinc-300">opendev-office.firebaseapp.com</code>
            </span>
            <Button onClick={() => onOpenChange(false)} variant="outline" size="sm">
              Close Inspection
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
