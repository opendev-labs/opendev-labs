import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Sparkles
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

interface DeveloperDashboardProps {
  onOpenAddClient: () => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ onOpenAddClient }) => {
  const navigate = useNavigate();
  const { clients, getWhatsAppReminderUrl, markPaymentStatus } = useClients();

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
      className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-zinc-900 font-sans"
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
              onClick={onOpenAddClient}
              className="px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-md transition-colors"
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
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
              ACTIVE RETAINERS
            </span>
            <div className="size-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Zap className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 font-mono">
              {activeRetainers.length}
            </div>
            <p className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1 mt-1">
              ↗ <span className="text-zinc-900 font-bold">LIVE</span> active hosting & maintenance
            </p>
          </div>
        </motion.div>

        {/* Metric 2: Monthly MRR */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
              TOTAL MONTHLY MRR
            </span>
            <div className="size-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Activity className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 font-mono">
              ₹{totalMRR.toLocaleString()}
            </div>
            <p className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1 mt-1">
              ↗ <span className="text-emerald-600 font-bold">+15.2%</span> retainer growth
            </p>
          </div>
        </motion.div>

        {/* Metric 3: Collection Rate */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
              COLLECTION RATE
            </span>
            <div className="size-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 font-mono">
              {activeRetainers.length > 0 ? Math.round((paidClients.length / activeRetainers.length) * 100) : 100}%
            </div>
            <p className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1 mt-1">
              ↗ <span className="text-emerald-600 font-bold">High</span> on-time collection
            </p>
          </div>
        </motion.div>

        {/* Metric 4: Completed Projects */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
              COMPLETED BUILDS
            </span>
            <div className="size-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Shield className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 font-mono">
              {offboardedClients.length}
            </div>
            <p className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1 mt-1">
              ↗ <span className="text-zinc-900 font-bold">100%</span> delivered & handed over
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. Main CRM Table & Alert Column */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Client Retainer CRM */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-zinc-900 tracking-tight">
                  Active Client Retainers & Quotations
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Includes Khawar (Elite-Trading Hub) & Vishwa Leader Institute.
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard/clients')}
                className="text-xs font-bold text-black hover:underline flex items-center gap-1"
              >
                Manage Full CRM <ArrowUpRight className="size-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto border border-zinc-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Client & Company</th>
                    <th className="p-3">Billing Type</th>
                    <th className="p-3">Monthly Fee</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                            {client.name}
                            <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black">
                              <ExternalLink className="size-3" />
                            </a>
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">{client.company}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        {client.billingType === 'monthly_retainer' ? (
                          <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[10px] font-extrabold border border-zinc-200">
                            Monthly Retainer
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200 text-zinc-500 text-[10px]">
                            Handover Build
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-mono font-bold text-zinc-900">
                        {client.billingType === 'monthly_retainer' ? (
                          <span>₹{client.monthlyFee.toLocaleString()}/mo</span>
                        ) : (
                          <span className="text-zinc-400 font-normal">N/A</span>
                        )}
                      </td>

                      <td className="p-3">
                        {client.status === 'paid' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                            PAID
                          </span>
                        )}
                        {client.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold">
                            PENDING
                          </span>
                        )}
                        {client.status === 'overdue' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-extrabold">
                            OVERDUE
                          </span>
                        )}
                        {client.status === 'offboarded' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[10px]">
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
                            className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] inline-flex items-center gap-1 hover:bg-emerald-700 transition-colors shadow-xs"
                          >
                            <Send className="size-3" /> WhatsApp Remind
                          </a>
                        ) : (
                          <button
                            onClick={() => markPaymentStatus(client.id, 'September 2026', 'paid')}
                            className="text-[10px] font-bold text-zinc-500 hover:text-black"
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
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs text-zinc-900">1-Click WhatsApp Trigger</h3>
                <p className="text-[11px] font-bold text-zinc-700 mt-0.5">
                  {overdueClients[0]?.name || 'TechMatrix Global'}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[9px] font-extrabold border border-red-200 uppercase">
                  OVERDUE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="text-[9px] uppercase font-extrabold text-zinc-400 block">RETAINER</span>
                <span className="text-xs font-mono font-extrabold text-zinc-900 block mt-0.5">
                  ₹{(overdueClients[0]?.monthlyFee || 15000).toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="text-[9px] uppercase font-extrabold text-zinc-400 block">DUE DATE</span>
                <span className="text-[10px] font-mono font-extrabold text-zinc-900 block mt-0.5 truncate">
                  {overdueClients[0]?.nextPaymentDue || '2026-09-01'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="text-[9px] uppercase font-extrabold text-zinc-400 block">STATUS</span>
                <span className="text-[10px] font-mono font-extrabold text-red-600 block mt-0.5 uppercase">
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
              className="w-full py-3 rounded-full bg-black hover:bg-zinc-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-colors text-center"
            >
              <Send className="size-3.5 text-emerald-400" /> Send WhatsApp Reminder Now
            </motion.a>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
