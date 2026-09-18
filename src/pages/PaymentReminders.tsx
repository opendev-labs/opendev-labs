import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BellRing,
  Send,
  CreditCard,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { Client } from '../types';
import { Button } from '../components/ui/Button';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const PaymentReminders: React.FC = () => {
  const { clients, getWhatsAppReminderUrl, getRazorpayLink, markPaymentStatus } = useClients();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeRetainers = clients.filter(c => c.billingType === 'monthly_retainer' && c.status !== 'offboarded');

  const overdueList = activeRetainers.filter(c => c.status === 'overdue');
  const pendingList = activeRetainers.filter(c => c.status === 'pending');
  const paidList = activeRetainers.filter(c => c.status === 'paid');

  const copyRazorpayLink = (client: Client) => {
    const link = getRazorpayLink(client);
    navigator.clipboard.writeText(link);
    setCopiedId(client.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Executive Hero Banner Card (Black Rectangle Welcome Card Header) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md">
              Automated Ledger & Notifications
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <BellRing className="size-7 text-amber-400 shrink-0" /> Monthly Payment Reminders & Ledger
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
            Trigger 1-click WhatsApp payment reminders, share Razorpay invoice links, and update monthly collection status.
          </p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 space-y-1">
          <span className="text-xs font-extrabold text-red-700 dark:text-red-300 uppercase">Overdue Collections</span>
          <div className="text-3xl font-extrabold text-red-900 dark:text-red-200 font-mono">
            ₹{overdueList.reduce((sum, c) => sum + c.monthlyFee, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-red-700 dark:text-red-400 font-bold block">{overdueList.length} Clients Overdue</span>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
          <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 uppercase">Upcoming Pending</span>
          <div className="text-3xl font-extrabold text-amber-900 dark:text-amber-200 font-mono">
            ₹{pendingList.reduce((sum, c) => sum + c.monthlyFee, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block">{pendingList.length} Payments Awaited</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 uppercase">Collected This Month</span>
          <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 font-mono">
            ₹{paidList.reduce((sum, c) => sum + c.monthlyFee, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">{paidList.length} Retainers Paid</span>
        </div>
      </div>

      {/* Overdue Alert Banner */}
      {overdueList.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-red-600 dark:text-red-400 shrink-0" />
            <div>
              <span className="font-extrabold block">Attention: {overdueList.length} client retainers are overdue for collection!</span>
              <span className="text-red-700 dark:text-red-300 font-medium">Use the 1-click WhatsApp trigger below to send automated reminders directly to client phones.</span>
            </div>
          </div>
        </div>
      )}

      {/* Ledger Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
            <Calendar className="size-4" /> Active Monthly Retainer Roster ({activeRetainers.length})
          </h2>
          <span className="text-xs font-mono text-zinc-500">Cycle: September 2026</span>
        </div>

        {activeRetainers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Client & Company</th>
                  <th className="p-4">Monthly Fee</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Collection Status</th>
                  <th className="p-4 text-right">Quick Remind & Pay Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                {activeRetainers.map(client => (
                  <tr key={client.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-zinc-900 dark:text-white text-sm">{client.name}</span>
                        <span className="text-zinc-500 text-[11px]">{client.company}</span>
                        <span className="text-[10px] text-zinc-400 font-mono mt-0.5">{client.phone}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-extrabold text-zinc-900 dark:text-white text-sm">
                      {client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()}/mo
                    </td>

                    <td className="p-4 font-mono text-zinc-600 dark:text-zinc-300">
                      Day {client.billingCycleDay || 10} of month ({client.nextPaymentDue || '2026-09-10'})
                    </td>

                    <td className="p-4">
                      {client.status === 'paid' && (
                        <span className="px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Paid
                        </span>
                      )}
                      {client.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold inline-flex items-center gap-1">
                          <Clock className="size-3" /> Pending
                        </span>
                      )}
                      {client.status === 'overdue' && (
                        <span className="px-2.5 py-1 rounded-full border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-[10px] font-extrabold inline-flex items-center gap-1">
                          <AlertTriangle className="size-3" /> Overdue
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {client.status !== 'paid' && (
                          <Button
                            size="sm"
                            onClick={() => markPaymentStatus(client.id, 'September 2026', 'paid')}
                            className="h-8 px-3 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="size-3.5" /> Mark Paid
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyRazorpayLink(client)}
                          className="h-8 px-2.5 text-xs font-bold border-zinc-300 dark:border-zinc-700 gap-1.5 rounded-lg"
                          title="Copy Razorpay Payment Link"
                        >
                          {copiedId === client.id ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                          {copiedId === client.id ? 'Copied' : 'Pay Link'}
                        </Button>

                        <a
                          href={getWhatsAppReminderUrl(client)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs px-3"
                          title="Send WhatsApp Payment Reminder"
                        >
                          <Send className="size-3.5" /> WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-zinc-500">
            No active monthly retainer clients found. Add clients in CRM to manage automated payment reminders.
          </div>
        )}
      </div>
    </div>
  );
};
