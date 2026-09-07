import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Users,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Send,
  ReceiptText,
  ExternalLink,
  ShieldCheck,
  Building2,
  Zap,
  Activity,
  Shield,
  Sparkles,
  Code,
  Layers,
  Trash2,
  UserCheck,
  X
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

interface DeveloperDashboardProps {
  onOpenAddClient: () => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ onOpenAddClient }) => {
  const navigate = useNavigate();
  const {
    clients,
    getWhatsAppReminderUrl,
    markPaymentStatus,
    projectRequests,
    changelogs,
    addChangelog,
    deleteChangelog,
    paymentNotifications,
    confirmPaymentNotification,
    rejectPaymentNotification,
  } = useClients();
  const { registeredUsers } = useAuth();

  const unconvertedUsers = registeredUsers.filter(u => u.role === 'user');

  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [logTitle, setLogTitle] = useState('');
  const [logVersion, setLogVersion] = useState('v1.0.0');
  const [logDesc, setLogDesc] = useState('');
  const [logClientId, setLogClientId] = useState('all');

  const handlePostChangelog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim() || !logDesc.trim()) return;

    const targetClient = clients.find(c => c.id === logClientId);
    addChangelog({
      clientId: logClientId,
      clientName: targetClient ? targetClient.name : 'All Clients',
      title: logTitle,
      version: logVersion,
      description: logDesc,
    });

    setLogTitle('');
    setLogDesc('');
    setShowChangelogModal(false);
  };

  // Metrics calculation
  const activeRetainers = clients.filter(c => c.billingType === 'monthly_retainer' && c.status !== 'offboarded');
  const totalMRR = activeRetainers.reduce((acc, c) => acc + c.monthlyFee, 0);

  const overdueClients = clients.filter(c => c.status === 'overdue');
  const totalOverdue = overdueClients.reduce((acc, c) => acc + c.monthlyFee, 0);

  const paidClients = clients.filter(c => c.status === 'paid');
  const pendingClients = clients.filter(c => c.status === 'pending');
  const offboardedClients = clients.filter(c => c.status === 'offboarded');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans"
    >
      
      {/* 1. Executive Hero Header */}
      <motion.div
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                Studio Admin Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                ● System Operational
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good day, Yash Ramteke 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Your software solutions & revenue dashboard is live, tracking active client retainers, domain health, and automated payment reminders.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChangelogModal(true)}
              className="px-5 py-2.5 rounded-full border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-md transition-colors"
            >
              <Code className="size-4 text-emerald-400" /> Post Developer Changelog
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAddClient}
              className="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-800 text-black dark:text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-md transition-colors"
            >
              <Plus className="size-4" /> Add New Client Partner
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2. Metric Cards Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Retainers */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400 dark:text-zinc-500 tracking-wider">
              ACTIVE RETAINERS
            </span>
            <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
              <Zap className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {activeRetainers.length}
            </div>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
              ↗ <span className="text-zinc-900 dark:text-white font-bold">LIVE</span> active hosting & maintenance
            </p>
          </div>
        </motion.div>

        {/* Metric 2: Monthly MRR */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400 dark:text-zinc-500 tracking-wider">
              TOTAL MONTHLY MRR
            </span>
            <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
              <Activity className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
              ₹{totalMRR.toLocaleString()}
            </div>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
              ↗ <span className="text-emerald-600 dark:text-emerald-400 font-bold">+15.2%</span> retainer growth
            </p>
          </div>
        </motion.div>

        {/* Metric 3: Collection Rate */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400 dark:text-zinc-500 tracking-wider">
              COLLECTION RATE
            </span>
            <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {activeRetainers.length > 0 ? Math.round((paidClients.length / activeRetainers.length) * 100) : 100}%
            </div>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
              ↗ <span className="text-emerald-600 dark:text-emerald-400 font-bold">High</span> on-time collection
            </p>
          </div>
        </motion.div>

        {/* Metric 4: Completed Projects */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400 dark:text-zinc-500 tracking-wider">
              COMPLETED BUILDS
            </span>
            <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
              <Shield className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {offboardedClients.length}
            </div>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
              ↗ <span className="text-zinc-900 dark:text-white font-bold">100%</span> delivered & handed over
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. Main CRM Table & Alert Column */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Client Retainer CRM */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Active Client Retainers & Quotations
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Includes Khawar (Elite-Trading Hub) & Vishwa Leader Institute.
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard/clients')}
                className="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1"
              >
                Manage Full CRM <ArrowUpRight className="size-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Client & Company</th>
                    <th className="p-3">Billing Type</th>
                    <th className="p-3">Monthly Fee</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            {client.name}
                            <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black dark:hover:text-white">
                              <ExternalLink className="size-3" />
                            </a>
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{client.company}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        {client.billingType === 'monthly_retainer' ? (
                          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-extrabold border border-zinc-200 dark:border-zinc-700">
                            Monthly Retainer
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-[10px]">
                            Handover Build
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-mono font-bold text-zinc-900 dark:text-white">
                        {client.billingType === 'monthly_retainer' ? (
                          <span>₹{client.monthlyFee.toLocaleString()}/mo</span>
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-500 font-normal">N/A</span>
                        )}
                      </td>

                      <td className="p-3">
                        {client.status === 'paid' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold">
                            PAID
                          </span>
                        )}
                        {client.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold">
                            PENDING
                          </span>
                        )}
                        {client.status === 'overdue' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[10px] font-extrabold">
                            OVERDUE
                          </span>
                        )}
                        {client.status === 'offboarded' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px]">
                            HANDOVER
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        {client.status === 'overdue' || client.status === 'pending' ? (
                          <a
                            href={getWhatsAppReminderUrl(client)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] inline-flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <Send className="size-3" /> WhatsApp Remind
                          </a>
                        ) : (
                          <button
                            onClick={() => markPaymentStatus(client.id, 'September 2026', 'paid')}
                            className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Right 1 Col: Payment Reminder Widget */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs text-zinc-900 dark:text-white">1-Click WhatsApp Trigger</h3>
                <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
                  {overdueClients[0]?.name || 'TechMatrix Global'}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-[9px] font-extrabold border border-red-200 dark:border-red-800 uppercase">
                  OVERDUE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-center">
                <span className="text-[9px] uppercase font-extrabold text-zinc-400 dark:text-zinc-500 block">RETAINER</span>
                <span className="text-xs font-mono font-extrabold text-zinc-900 dark:text-white block mt-0.5">
                  ₹{(overdueClients[0]?.monthlyFee || 15000).toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-center">
                <span className="text-[9px] uppercase font-extrabold text-zinc-400 dark:text-zinc-500 block">DUE DATE</span>
                <span className="text-[10px] font-mono font-extrabold text-zinc-900 dark:text-white block mt-0.5 truncate">
                  {overdueClients[0]?.nextPaymentDue || '2026-09-01'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-center">
                <span className="text-[9px] uppercase font-extrabold text-zinc-400 dark:text-zinc-500 block">STATUS</span>
                <span className="text-[10px] font-mono font-extrabold text-red-600 dark:text-red-400 block mt-0.5 uppercase">
                  {overdueClients[0]?.status || 'Overdue'}
                </span>
              </div>
            </div>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={overdueClients[0] ? getWhatsAppReminderUrl(overdueClients[0]) : '/dashboard/reminders'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-colors text-center"
            >
              <Send className="size-3.5 text-emerald-400 dark:text-emerald-600" /> Send WhatsApp Reminder Now
            </motion.a>
          </div>
        </motion.div>

      </div>

      {/* 4. Incoming User Project Specifications & Custom Feature Requests */}
      <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="size-4 text-emerald-500" /> Incoming User Project Specifications
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Submitted by Google logged-in users detailing software features, target domain, and extra requirements.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-extrabold">
            {projectRequests.length} Submissions
          </span>
        </div>

        {projectRequests.length === 0 ? (
          <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-center text-xs text-zinc-500 font-medium">
            No custom project specs submitted yet. Incoming user requests will appear here.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectRequests.map(req => (
              <div key={req.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3 flex flex-col justify-between text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-zinc-900 dark:text-white">{req.userName}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{req.createdAt}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono block">{req.userEmail}</span>
                  
                  <div className="pt-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block">Requested Build Type</span>
                    <span className="font-bold text-black dark:text-white block">{req.projectType}</span>
                  </div>

                  {req.requestedDomain && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block">Desired Domain</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">{req.requestedDomain}</span>
                    </div>
                  )}

                  {req.extraRequirements && (
                    <div className="space-y-0.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block">Extra Specs</span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium line-clamp-3 leading-relaxed">
                        {req.extraRequirements}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={onOpenAddClient}
                  className="w-full h-8 mt-2 text-[11px] font-extrabold rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="size-3.5" /> Convert User to Client
                </Button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 4.5. Incoming Cash / GPay / PhonePe Payment Reports */}
      <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-500" /> Incoming Cash & GPay Payment Reports
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Submitted by clients notifying off-gateway payments (GPay, PhonePe, Cash in hand). 1-click confirm marks retainer paid.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-extrabold">
            {paymentNotifications.length} Total Reports
          </span>
        </div>

        {paymentNotifications.length === 0 ? (
          <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-center text-xs text-zinc-500 font-medium">
            No offline payment notifications reported yet. When clients report Cash or GPay payments, they will appear here for verification.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentNotifications.map(notif => (
              <div key={notif.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3 flex flex-col justify-between text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-zinc-900 dark:text-white">{notif.clientName}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{notif.date}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">Amount & Mode</span>
                      <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{notif.amount.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white block text-[11px]">
                      Method: {notif.paymentMethod}
                    </span>
                    {notif.transactionRef && (
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block truncate">
                        Ref: {notif.transactionRef}
                      </span>
                    )}
                  </div>

                  <div>
                    {notif.status === 'pending_verification' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] uppercase">
                        ⏳ Verification Pending
                      </span>
                    )}
                    {notif.status === 'confirmed' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                        ✅ Confirmed & Marked Paid
                      </span>
                    )}
                    {notif.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 font-extrabold text-[10px] uppercase">
                        ❌ Rejected
                      </span>
                    )}
                  </div>
                </div>

                {notif.status === 'pending_verification' && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={() => confirmPaymentNotification(notif.id)}
                      className="flex-1 h-8 text-[10px] font-extrabold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="size-3" /> Confirm & Mark Paid
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => rejectPaymentNotification(notif.id)}
                      className="h-8 text-[10px] font-bold rounded-full border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 5. Post Developer Changelog Modal */}
      <AnimatePresence>
        {showChangelogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-black dark:bg-white text-white dark:text-black">
                    <Code className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">Post Developer Changelog</h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      Publish code updates & release notes to client portal dashboards.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChangelogModal(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handlePostChangelog} className="space-y-3.5 text-xs">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Target Client</label>
                    <select
                      value={logClientId}
                      onChange={e => setLogClientId(e.target.value)}
                      className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
                    >
                      <option value="all">Broadcast to All Clients</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Release Version</label>
                    <Input
                      placeholder="e.g. v1.2.0"
                      value={logVersion}
                      onChange={e => setLogVersion(e.target.value)}
                      className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Update Title</label>
                  <Input
                    placeholder="e.g. Razorpay Payment Gateway & SSL Live"
                    value={logTitle}
                    onChange={e => setLogTitle(e.target.value)}
                    className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Changelog Description / Release Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Paste your release notes, bug fixes, deployed features, or maintenance updates..."
                    value={logDesc}
                    onChange={e => setLogDesc(e.target.value)}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl focus:outline-none focus:border-black dark:focus:border-white font-medium"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowChangelogModal(false)}
                    className="h-9 px-4 rounded-full text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-9 px-6 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs rounded-full shadow-xs"
                  >
                    Publish Changelog
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
