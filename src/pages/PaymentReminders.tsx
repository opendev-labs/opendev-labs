import React, { useState } from 'react';
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
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <BellRing className="size-6 text-amber-600 dark:text-amber-400" /> Monthly Payment Reminders & Ledger
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
          Trigger 1-click WhatsApp payment reminders, share Razorpay invoice links, and update monthly collection status.
        </p>
      </div>

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
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block">{pendingList.length} Clients Pending</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 uppercase">Collected This Month</span>
          <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 font-mono">
            ₹{paidList.reduce((sum, c) => sum + c.monthlyFee, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">{paidList.length} Paid</span>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">Active Retainer Clients & WhatsApp Actions</h2>

        <div className="grid gap-4">
          {activeRetainers.map(client => {
            const waUrl = getWhatsAppReminderUrl(client);

            return (
              <div
                key={client.id}
                className={`p-6 rounded-2xl border transition-all ${
                  client.status === 'overdue'
                    ? 'border-red-300 dark:border-red-800 bg-red-50/40 dark:bg-red-950/30 shadow-xs'
                    : client.status === 'pending'
                    ? 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Client Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-zinc-900 dark:text-white">{client.name}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">({client.company})</span>
                      {client.status === 'overdue' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-[10px] font-extrabold">
                          OVERDUE
                        </span>
                      )}
                      {client.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold">
                          DUE SOON
                        </span>
                      )}
                      {client.status === 'paid' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                          PAID
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 font-medium pt-1">
                      <span>Fee: <strong className="text-zinc-900 dark:text-white">₹{client.monthlyFee.toLocaleString()}/mo</strong></span>
                      <span>Next Due: <strong className="text-zinc-900 dark:text-white">{client.nextPaymentDue}</strong></span>
                      <span>Phone: <strong className="text-zinc-900 dark:text-white">{client.phone}</strong></span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyRazorpayLink(client)}
                      className="text-xs gap-1.5 h-9 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full font-bold"
                    >
                      {copiedId === client.id ? <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-3.5" />}
                      {copiedId === client.id ? 'Razorpay Link Copied!' : 'Copy Razorpay Link'}
                    </Button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Send className="size-3.5" /> Send WhatsApp Reminder
                    </a>

                    {client.status !== 'paid' ? (
                      <Button
                        size="sm"
                        onClick={() => markPaymentStatus(client.id, 'September 2026', 'paid')}
                        className="h-9 text-xs bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold rounded-full px-4"
                      >
                        Mark as Paid
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markPaymentStatus(client.id, 'September 2026', 'pending')}
                        className="h-9 text-xs border-zinc-300 dark:border-zinc-700 rounded-full font-medium"
                      >
                        Mark Pending
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
