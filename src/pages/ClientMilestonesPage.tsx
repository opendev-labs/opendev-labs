import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const ClientMilestonesPage: React.FC = () => {
  const { user } = useAuth();
  const { clients } = useClients();

  const client = clients.find(c => c.id === user?.clientId);
  const websiteStatus = client?.websiteStatus || 'under-development';

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
              Project Lifecycle Tracking
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Software Engineering Roadmap & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
            Track progress from initial specification phase through full production deployment and ongoing maintenance.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6 shadow-sm"
          >
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Zap className="size-5 text-amber-500" /> Milestones Roadmap
              </h3>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-700 dark:text-zinc-300">Overall Completion Status</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {websiteStatus === 'completed' ? '100%' : '65%'}
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                  style={{ width: websiteStatus === 'completed' ? '100%' : '65%' }}
                />
              </div>
            </div>

            {/* Roadmap Timeline List */}
            <div className="space-y-4 pt-2">
              {[
                {
                  step: '01',
                  title: 'Requirement Discovery & Architecture Plan',
                  desc: 'Scope project features, select Tech Stack (React/Vite/Node/PostgreSQL), and define database models.',
                  status: 'completed',
                },
                {
                  step: '02',
                  title: 'UI/UX Design & Component Wireframing',
                  desc: 'Build dark/light mode modern responsive interfaces with interactive micro-animations.',
                  status: 'completed',
                },
                {
                  step: '03',
                  title: 'Full-Stack Development & API Integration',
                  desc: 'Implement user login, Razorpay/GPay payment workflows, and real-time dashboard data sync.',
                  status: websiteStatus === 'completed' ? 'completed' : 'in_progress',
                },
                {
                  step: '04',
                  title: 'Security Audit & Quality Control',
                  desc: 'Run automated build checks, verify SSL certificates, and audit API routes.',
                  status: websiteStatus === 'completed' ? 'completed' : 'pending',
                },
                {
                  step: '05',
                  title: 'Production Deployment & Custom Domain Linking',
                  desc: 'Deploy live build to global CDN with custom domain configuration.',
                  status: websiteStatus === 'completed' ? 'completed' : 'pending',
                },
                {
                  step: '06',
                  title: 'Monthly Retainer Maintenance & Daily Backups',
                  desc: '24/7 uptime monitoring, daily server snapshots, and regular feature updates.',
                  status: websiteStatus === 'completed' ? 'in_progress' : 'pending',
                },
              ].map(item => (
                <div
                  key={item.step}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-start gap-4 text-xs"
                >
                  <div
                    className={`size-8 rounded-full flex items-center justify-center font-mono font-extrabold shrink-0 ${
                      item.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : item.status === 'in_progress'
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                    }`}
                  >
                    {item.status === 'completed' ? <Check className="size-4" /> : item.step}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-zinc-900 dark:text-white text-xs">{item.title}</h4>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          item.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : item.status === 'in_progress'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" /> Target Delivery Timeline
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Standard custom build timeline is <span className="font-extrabold text-zinc-900 dark:text-white">3 to 7 working days</span> from project spec submission to live production deployment.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
