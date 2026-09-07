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
  CircleDollarSign
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

  const client = clients.find(c => c.id === user?.clientId);
  const userRequest = projectRequests.find(r => r.userEmail.toLowerCase() === user?.email?.toLowerCase());
  const clientChangelogs = changelogs.filter(
    c => c.clientId === 'all' || (client && c.clientId === client.id)
  );

  // Overview / Specs form state
  const [projectType, setProjectType] = useState(userRequest?.projectType || 'Custom WebApp');
  const [requestedDomain, setRequestedDomain] = useState(userRequest?.requestedDomain || '');
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

  const displayName = user?.name || client?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const clientDomain = client?.domain || client?.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || requestedDomain || 'Not set yet';
  const websiteStatus = client?.websiteStatus || 'under-development';

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
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md">
                {client ? 'Verified Client Partner Portal' : 'User Account Dashboard'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">ID: {client?.id || user?.id || 'user-active'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Signed in as <span className="text-white font-bold">{user?.email}</span>. Manage your project specifications, set target domain names, and track developer release notes.
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

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Project Specs & Release Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Project Configuration & Specs Form */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                  <Layers className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    Project Configuration & Custom Requirements
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    Specify what you want built, your desired domain name, and custom features.
                  </p>
                </div>
              </div>
              {userRequest && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                  ✓ Saved Spec Active
                </span>
              )}
            </div>

            {specSavedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                Project specs saved successfully! Lead Architect Yash Ramteke has received your project details.
              </div>
            )}

            <form onSubmit={handleSaveProjectSpec} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    What do you want me to build?
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-xl focus:outline-none focus:border-black dark:focus:border-white font-medium"
                  >
                    <option value="Custom WebApp">Custom WebApp (React / Vite / Node)</option>
                    <option value="E-Commerce Store">E-Commerce Store (Full Payment Gateway)</option>
                    <option value="Trading System / Financial App">Trading System / Financial Platform</option>
                    <option value="SaaS Application">SaaS Application & Dashboard</option>
                    <option value="Corporate Website">Corporate / Portfolio Website</option>
                    <option value="Custom Software">Custom Enterprise Software</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Target Domain Name
                  </label>
                  <Input
                    placeholder="e.g. mycompany.com"
                    value={requestedDomain}
                    onChange={e => setRequestedDomain(e.target.value)}
                    className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">
                  Extra Requirements & Features Needed
                </label>
                <textarea
                  rows={3}
                  placeholder="List any extra requirements, custom integrations, Razorpay payments, admin panel needs, design guidelines, or target timeline..."
                  value={extraRequirements}
                  onChange={e => setExtraRequirements(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-xl focus:outline-none focus:border-black dark:focus:border-white font-medium"
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto px-6 h-10 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="size-3.5" /> Submit Project Specifications
              </Button>
            </form>
          </motion.div>

          {/* Developer Changelogs */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Code className="size-4 text-black dark:text-white" /> Development Changelogs & Release Notes
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Updates from Lead Architect Yash Ramteke
              </span>
            </div>

            {clientChangelogs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-center space-y-1">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  No changelogs or release notes posted yet.
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  When developer Yash Ramteke pushes code updates or feature releases, notes will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {clientChangelogs.map(log => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {log.version && (
                          <span className="px-2.5 py-0.5 rounded-md bg-black dark:bg-white text-white dark:text-black font-mono font-extrabold text-[10px]">
                            {log.version}
                          </span>
                        )}
                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs">{log.title}</h4>
                      </div>
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Live Website Deployment Card */}
          {client && (
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex size-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900 dark:text-white tracking-tight uppercase">
                    Website Status
                  </span>
                </div>
                <div>
                  {websiteStatus === 'under-development' && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] uppercase">
                      🔨 Under Dev
                    </span>
                  )}
                  {websiteStatus === 'completed' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                      ✅ Live
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Hosted Domain</span>
                <a
                  href={client.websiteUrl || `https://${clientDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-mono font-extrabold text-zinc-900 dark:text-white hover:underline flex items-center gap-2 truncate"
                >
                  {clientDomain} <ExternalLink className="size-3.5 text-zinc-400" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Direct Contact Card */}
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
              Direct engineering support maintained by Lead Architect Yash Shirish Ramteke under OpenDev-Labs.
            </p>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
