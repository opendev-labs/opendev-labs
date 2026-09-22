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
  Server,
  Monitor,
  Layout,
  CheckSquare,
  Lock
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
  const userRequest = (projectRequests || []).find(r => (r?.userEmail || '').toLowerCase() === (user?.email || '').toLowerCase());
  const clientChangelogs = changelogs.filter(
    c => c.clientId === 'all' || (client && c.clientId === client.id)
  );

  // Specifications state
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

  const displayName = client?.name || user?.name || (user?.email ? user.email.split('@')[0] : 'Client Partner');
  const clientDomain = client?.domain || client?.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || requestedDomain || 'elite-tradinghub.com';
  const liveUrl = client?.livePreviewUrl || client?.websiteUrl || `https://${clientDomain}`;
  const devUrl = client?.devPreviewUrl || `https://${clientDomain.split('.')[0]}-dev.vercel.app`;

  const workStatus = client?.workStatus || 'work_started';
  const progressPercentage = client?.progressPercentage !== undefined
    ? client.progressPercentage
    : (workStatus === 'completed' ? 100 : workStatus === 'testing_preview' ? 85 : workStatus === 'work_started' ? 50 : 25);

  const totalBill = client?.totalBill || 70000;
  const advanceAmount = client?.advanceAmount || 25000;
  const advancePaid = client?.advancePaid !== undefined ? client.advancePaid : true;
  const monthlyFee = client?.monthlyFee || 45000;

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* 1. Executive Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl border border-zinc-800">
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
              <span className="text-xs text-zinc-300 font-mono font-bold">Domain: {clientDomain}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Your sovereign website portal is active for <span className="text-white font-bold">{clientDomain}</span>. Track development progress, live preview screens, advance payments, and retainer invoices below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {client && monthlyFee > 0 && (
              <a
                href={getRazorpayLink(client)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
              >
                <CreditCard className="size-4" /> Pay Monthly Maintenance (₹{monthlyFee.toLocaleString()})
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. TWO MINI SCREEN PREVIEWS (ABOVE PROGRESS BAR) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="size-5 text-blue-500" />
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Website Previews & Environments
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-medium">Real-time Staging & Live Production Views</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* MINI SCREEN 1: LIVE PRODUCTION PREVIEW [.com] */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            {/* Window Top Bar */}
            <div className="px-4 py-3 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-red-400 inline-block" />
                  <span className="size-3 rounded-full bg-amber-400 inline-block" />
                  <span className="size-3 rounded-full bg-emerald-400 inline-block" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <Globe className="size-3" /> Live Production Domain (.com)
                </span>
              </div>

              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open Live Site</span> <ExternalLink className="size-3" />
              </a>
            </div>

            {/* Address Bar */}
            <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center gap-2">
              <Lock className="size-3.5 text-emerald-500 shrink-0" />
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate font-semibold">
                {liveUrl}
              </span>
            </div>

            {/* Preview Frame Box */}
            <div className="p-6 bg-zinc-950 text-white min-h-[200px] flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group">
              <div className="size-12 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Globe className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">{clientDomain}</h3>
                <p className="text-xs text-zinc-400">Official Production Domain Environment</p>
              </div>
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-full bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all shadow-md inline-flex items-center gap-1.5"
              >
                View Live Site <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          {/* MINI SCREEN 2: DEVELOPMENT PREVIEW [.vercel.app] */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            {/* Window Top Bar */}
            <div className="px-4 py-3 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-red-400 inline-block" />
                  <span className="size-3 rounded-full bg-amber-400 inline-block" />
                  <span className="size-3 rounded-full bg-emerald-400 inline-block" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 font-mono text-[10px] font-extrabold border border-purple-300 dark:border-purple-800 flex items-center gap-1">
                  <Monitor className="size-3" /> Vercel Staging Build (.vercel.app)
                </span>
              </div>

              <a
                href={devUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Open Vercel Build</span> <ExternalLink className="size-3" />
              </a>
            </div>

            {/* Address Bar */}
            <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center gap-2">
              <Code className="size-3.5 text-purple-500 shrink-0" />
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate font-semibold">
                {devUrl}
              </span>
            </div>

            {/* Preview Frame Box */}
            <div className="p-6 bg-zinc-950 text-white min-h-[200px] flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group">
              <div className="size-12 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Monitor className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">Vercel Staging Build</h3>
                <p className="text-xs text-zinc-400">Development Build & Feature Testing Sandbox</p>
              </div>
              <a
                href={devUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-full bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-700 transition-all shadow-md inline-flex items-center gap-1.5"
              >
                View Vercel Dev Build <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. PROJECT DEVELOPMENT PROGRESS BAR (BELOW MINI SCREENS) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200 dark:border-blue-900 inline-block mb-1">
              Project Lifecycle Status
            </span>
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="size-5 text-blue-500" /> Website Development Progress ({progressPercentage}%)
            </h2>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-extrabold text-xs capitalize border border-blue-300 dark:border-blue-800 self-start">
            Current Stage: {workStatus.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* 4 Milestone Step Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className={`p-3 rounded-xl border text-center ${progressPercentage >= 25 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'}`}>
              <CheckCircle2 className="size-4 text-emerald-500 mx-auto mb-1" />
              <span className="font-extrabold block">1. Access & Code</span>
              <span className="text-[10px] opacity-75">Code Issued</span>
            </div>

            <div className={`p-3 rounded-xl border text-center ${progressPercentage >= 50 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'}`}>
              <Wrench className="size-4 text-amber-500 mx-auto mb-1" />
              <span className="font-extrabold block">2. Work Started</span>
              <span className="text-[10px] opacity-75">In Development</span>
            </div>

            <div className={`p-3 rounded-xl border text-center ${progressPercentage >= 85 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'}`}>
              <Monitor className="size-4 text-purple-500 mx-auto mb-1" />
              <span className="font-extrabold block">3. Vercel Staging</span>
              <span className="text-[10px] opacity-75">Testing Build</span>
            </div>

            <div className={`p-3 rounded-xl border text-center ${progressPercentage >= 100 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'}`}>
              <Globe className="size-4 text-blue-500 mx-auto mb-1" />
              <span className="font-extrabold block">4. Live Production</span>
              <span className="text-[10px] opacity-75">Domain Deployed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DOMAIN DETAILS & FINANCIAL OVERVIEW CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Card 1: Domain & Website Specs */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-blue-500" />
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-tight">
                Domain Details & Server Status
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
              Active & Monitored
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Target Domain</span>
              <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 truncate block">
                {clientDomain}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Domain Status</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">
                Active & DNS Ready
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">SSL Certificate</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">
                256-Bit Encrypted
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Website Status</span>
              <span className="font-extrabold text-zinc-900 dark:text-white capitalize block">
                {workStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Advance Paid & Billing Overview */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <CircleDollarSign className="size-5 text-emerald-500" />
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-tight">
                Billing & Advance Status
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-500 font-bold">Total Project Bill:</span>
                <span className="font-extrabold text-zinc-900 dark:text-white">₹{totalBill.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-900 dark:text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-emerald-500" /> Advance Received:
                </span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                  {advancePaid ? `✅ Received (₹${advanceAmount.toLocaleString()})` : 'Pending'}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-500 font-bold">Monthly Retainer:</span>
                <span className="font-extrabold text-zinc-900 dark:text-white">
                  ₹{monthlyFee.toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>

          {client && monthlyFee > 0 && (
            <a
              href={getRazorpayLink(client)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <CreditCard className="size-4" /> Pay Monthly Maintenance (₹{monthlyFee.toLocaleString()})
            </a>
          )}
        </div>

      </div>

      {/* 5. Request Edits & Support */}
      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
            <Wrench className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Submit Website Feature / Content Requests
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Need content updated, layout changed, or a new feature added to your website? Submit directly to Yash.
            </p>
          </div>
        </div>

        {specSavedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            Website request sent directly to Yash Ramteke!
          </div>
        )}

        <form onSubmit={handleSaveProjectSpec} className="space-y-3 text-xs">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Target Domain</label>
              <Input
                value={requestedDomain}
                onChange={e => setRequestedDomain(e.target.value)}
                className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Request Category</label>
              <Input
                value={projectType}
                onChange={e => setProjectType(e.target.value)}
                className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Details / Requirements</label>
            <textarea
              rows={3}
              value={extraRequirements}
              onChange={e => setExtraRequirements(e.target.value)}
              placeholder="Describe the edits or features you'd like added..."
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <Button
            type="submit"
            className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2"
          >
            <Send className="size-3.5" /> Submit Request to Yash
          </Button>
        </form>
      </div>

    </div>
  );
};

export default ClientPortal;
