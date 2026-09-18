import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Plus,
  HelpCircle,
  FileText,
  Clock,
  Phone,
  Mail,
  ReceiptText,
  Send,
  Wrench,
  Sparkles,
  Layers,
  Code,
  Check,
  Zap,
  ArrowRight,
  TrendingUp,
  CircleDollarSign,
  Key,
  Shield,
  Activity,
  Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const ClientPortal: React.FC = () => {
  const { user } = useAuth();
  const {
    clients,
    getRazorpayLink,
    projectRequests,
    addProjectRequest,
    changelogs,
  } = useClients();

  const client = clients.find(c => c.id === user?.clientId || c.email.toLowerCase() === user?.email?.toLowerCase());
  const userRequest = projectRequests.find(r => r.userEmail.toLowerCase() === user?.email?.toLowerCase());
  const clientChangelogs = changelogs.filter(
    c => c.clientId === 'all' || (client && c.clientId === client.id)
  );

  // Overview / Specs form state
  const [projectType, setProjectType] = useState(userRequest?.projectType || 'Custom WebApp');
  const [requestedDomain, setRequestedDomain] = useState(userRequest?.requestedDomain || client?.domain || '');
  const [extraRequirements, setExtraRequirements] = useState(userRequest?.extraRequirements || '');
  const [specSavedSuccess, setSpecSavedSuccess] = useState(false);

  const handleSaveProjectSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addProjectRequest({
      userEmail: user.email,
      userName: user.name || (user.email ? user.email.split('@')[0] : 'User'),
      projectType,
      requestedDomain,
      extraRequirements,
    });

    setSpecSavedSuccess(true);
    setTimeout(() => setSpecSavedSuccess(false), 4000);
  };

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

  const displayName = client?.name || user?.name || (user?.email ? user.email.split('@')[0] : 'Client Partner');
  const clientDomain = client?.domain || client?.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || requestedDomain || 'Not set yet';
  const websiteStatus = client?.websiteStatus || 'completed';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans"
    >
      {/* Executive Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5">
                <CheckCircle2 className="size-3 text-emerald-400" /> Verified Client Partner
              </span>
              {client?.clientCode && (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[10px] font-extrabold tracking-wider uppercase">
                  Code: {client.clientCode}
                </span>
              )}
              <span className="text-xs text-zinc-400 font-mono">Domain: {clientDomain}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Your website dashboard is active for <span className="text-white font-bold">{clientDomain}</span>. Check your live website status, monthly retainer payments, and submit maintenance requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {client && client.monthlyFee > 0 && (
              <a
                href={getRazorpayLink(client)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
              >
                <CreditCard className="size-4" /> Pay Retainer ({client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()})
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Vercel-Style Website Status & Financial Overview Grid (TOP CARDS) */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Card 1: Vercel-like Website Status Preview */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
              </div>
              <span className="font-extrabold text-sm text-zinc-900 dark:text-white tracking-tight uppercase">
                Live Website Status & Preview
              </span>
            </div>

            <div>
              {websiteStatus === 'completed' && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] uppercase">
                  🟢 Live & Operational
                </span>
              )}
              {websiteStatus === 'under-development' && (
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] uppercase">
                  🔨 Under Development
                </span>
              )}
            </div>
          </div>

          {/* Embedded Web Preview Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                <Globe className="size-4 text-blue-500" /> https://{clientDomain}
              </span>
              <a
                href={client?.websiteUrl || `https://${clientDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black font-extrabold text-[11px] inline-flex items-center gap-1.5 hover:opacity-90 shadow-xs"
              >
                Open Website <ExternalLink className="size-3" />
              </a>
            </div>

            {/* Simulated Live Vercel-style status metrics for non-tech clients */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">SSL Security</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="size-3.5" /> 256-bit Encrypted
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Hosting & CDN</span>
                <span className="text-xs font-extrabold text-zinc-900 dark:text-white flex items-center justify-center gap-1">
                  <Server className="size-3.5 text-blue-500" /> Global Edge
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Website Uptime</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                  <Activity className="size-3.5" /> 99.98% Monitored
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Last Update</span>
                <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                  {client?.joinedDate || '2026-09-15'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Financial Summary ("What You Paid For") */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                <CircleDollarSign className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  What You Have Paid For
                </h3>
                <span className="text-[11px] text-zinc-500 font-medium">Billing & Retainer Summary</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-500 font-bold">Advance Payment:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Paid (₹{(client?.advanceAmount || 25000).toLocaleString()})
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-500 font-bold">Monthly Maintenance:</span>
                <span className="font-extrabold text-zinc-900 dark:text-white">
                  ₹{(client?.monthlyFee || 4000).toLocaleString()}/month
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-500 font-bold">Next Retainer Due:</span>
                <span className="font-extrabold text-zinc-900 dark:text-white font-mono">
                  {client?.nextPaymentDue || '2026-10-05'}
                </span>
              </div>
            </div>
          </div>

          {client && (
            <a
              href={getRazorpayLink(client)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-extrabold text-xs inline-flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
            >
              <CreditCard className="size-4" /> Pay Monthly Retainer
            </a>
          )}
        </motion.div>

      </div>

      {/* Simplified Below-Card Content */}
      <div className="grid lg:grid-cols-3 gap-8 pt-2">
        
        {/* Left 2 Cols: Simple Website Request Form & Release Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Simple Website Feature / Edit Request Form */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                <Wrench className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Request Website Edits or New Features
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Need content changed, text updated, or a new feature added to your website? Submit here directly to Yash.
                </p>
              </div>
            </div>

            {specSavedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                Request received! Yash Ramteke will update your website shortly.
              </div>
            )}

            <form onSubmit={handleSaveProjectSpec} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Request Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe what you want updated on your website (e.g. change phone number, add new image, update pricing text)..."
                  value={extraRequirements}
                  onChange={e => setExtraRequirements(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-xl font-medium focus:outline-none focus:border-black dark:focus:border-white resize-none"
                />
              </div>

              <Button
                type="submit"
                className="px-6 h-10 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="size-3.5" /> Submit Request to Developer Yash
              </Button>
            </form>
          </motion.div>

          {/* Release Notes & Updates Timeline */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Code className="size-4 text-black dark:text-white" /> Website Release Notes & Completed Updates
              </h3>
            </div>

            {clientChangelogs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-center space-y-1">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  No recent website updates logged.
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  When developer Yash Ramteke deploys updates to your site, notes will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {clientChangelogs.map(log => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-zinc-900 dark:text-white text-xs">{log.title}</h4>
                      <span className="text-[11px] text-zinc-400 font-mono">{log.date}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 font-medium whitespace-pre-wrap leading-relaxed">
                      {log.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Developer Contact & Credentials Quick Access */}
        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Mail className="size-4 text-black dark:text-white" /> Lead Developer Contact
            </h3>
            
            <div className="space-y-2.5 text-xs font-mono text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <Mail className="size-4 text-zinc-500 shrink-0" />
                <span className="truncate">opendev.office@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <Phone className="size-4 text-zinc-500 shrink-0" />
                <span>+91 81695 68582</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium pt-1">
              Maintained directly by Lead Architect Yash Shirish Ramteke under OpenDev-Labs.
            </p>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default ClientPortal;
