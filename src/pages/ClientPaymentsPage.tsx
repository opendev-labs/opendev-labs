import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  CircleDollarSign,
  Send,
  CheckCircle2,
  Clock,
  ReceiptText,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const ClientPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    clients,
    getRazorpayLink,
    invoices,
    paymentNotifications,
    notifyPayment,
  } = useClients();

  const client = clients.find(c => c.id === user?.clientId);
  const clientInvoices = client ? invoices.filter(i => i.clientId === client.id) : [];
  const clientPaymentNotifs = client
    ? paymentNotifications.filter(p => p.clientId === client.id)
    : user
    ? paymentNotifications.filter(p => p.clientName.toLowerCase() === (user.name || user.email).toLowerCase())
    : [];

  // Payment notification form state
  const [payMethod, setPayMethod] = useState<'GPay' | 'PhonePe' | 'Cash' | 'Bank Transfer / NEFT' | 'Razorpay'>('GPay');
  const [payAmount, setPayAmount] = useState(client ? client.monthlyFee.toString() : '4000');
  const [payRef, setPayRef] = useState('');
  const [payNotifySuccess, setPayNotifySuccess] = useState(false);

  const handleNotifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;

    notifyPayment({
      clientId: client?.id || `user-${user?.id || 'temp'}`,
      clientName: client?.name || user?.name || user?.email?.split('@')[0] || 'User',
      clientEmail: user?.email || client?.email || 'client@opendev-labs.com',
      amount: Number(payAmount),
      paymentMethod: payMethod,
      transactionRef: payRef,
    });

    setPayRef('');
    setPayNotifySuccess(true);
    setTimeout(() => setPayNotifySuccess(false), 4000);
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans"
    >
      {/* Page Header */}
      <motion.div
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md">
                Billing & Retainer Management
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Payments & Manual Payment Notify
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Pay retainers online via automated Razorpay or inform developer Yash Ramteke if you paid via GPay, PhonePe, Cash, or Bank Transfer.
            </p>
          </div>

          {client && client.monthlyFee > 0 && (
            <a
              href={getRazorpayLink(client)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-lg transition-all shrink-0"
            >
              <CreditCard className="size-4" /> Pay via Razorpay ({client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()})
            </a>
          )}
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Notify Developer Form & Notification History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Notify Admin Form Card */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  <CircleDollarSign className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    Notify Developer of Cash / GPay / UPI Payment
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    If you paid directly via Google Pay, PhonePe, Cash, or Bank Transfer, inform developer Yash Ramteke here to confirm your account status.
                  </p>
                </div>
              </div>
            </div>

            {payNotifySuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                Payment notification sent! Admin Yash Ramteke has been notified to verify your transaction.
              </div>
            )}

            <form onSubmit={handleNotifyPayment} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Payment Mode</label>
                  <select
                    value={payMethod}
                    onChange={e => setPayMethod(e.target.value as any)}
                    className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
                  >
                    <option value="GPay">Google Pay (GPay)</option>
                    <option value="PhonePe">PhonePe / UPI</option>
                    <option value="Cash">Cash in Hand</option>
                    <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                    <option value="Razorpay">Razorpay Online</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Amount Paid (₹)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 4000"
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    className="h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">UTR / Ref No / Note</label>
                  <Input
                    placeholder="e.g. GPay UTR 42918491823"
                    value={payRef}
                    onChange={e => setPayRef(e.target.value)}
                    className="h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto px-6 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="size-3.5" /> Submit Payment Notification to Developer
              </Button>
            </form>
          </motion.div>

          {/* Submitted Payment Notifications List */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Clock className="size-4 text-black dark:text-white" /> Submitted Payment Notifications History
            </h3>

            {clientPaymentNotifs.length === 0 ? (
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-center text-xs text-zinc-500 font-medium">
                No payment notifications submitted yet. Use the form above to inform developer Yash Ramteke whenever you pay via GPay, Cash, or UPI.
              </div>
            ) : (
              <div className="space-y-2.5">
                {clientPaymentNotifs.map(notif => (
                  <div
                    key={notif.id}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-zinc-900 dark:text-white">
                          ₹{notif.amount.toLocaleString()} via {notif.paymentMethod}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">Date: {notif.date}</span>
                      </div>
                      {notif.transactionRef && (
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono block">
                          Ref: {notif.transactionRef}
                        </span>
                      )}
                    </div>

                    <div>
                      {notif.status === 'pending_verification' && (
                        <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] uppercase">
                          ⏳ Pending Admin Verification
                        </span>
                      )}
                      {notif.status === 'confirmed' && (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                          ✅ Payment Confirmed
                        </span>
                      )}
                      {notif.status === 'rejected' && (
                        <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 font-extrabold text-[10px] uppercase">
                          ❌ Verification Failed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>

        {/* Right Column: Razorpay Automation & Partner Watermark */}
        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5 shadow-sm relative overflow-hidden"
          >
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-extrabold uppercase">
                Razorpay Direct Automation
              </span>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Pay Online via Razorpay
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                Fast online payments using Credit/Debit Cards, NetBanking, and UPI through automated Razorpay integration.
              </p>
            </div>

            {client ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">Current Monthly Retainer</span>
                  <span className="text-xl font-mono font-extrabold text-zinc-900 dark:text-white block mt-0.5">
                    {client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()}/mo
                  </span>
                </div>

                <a
                  href={getRazorpayLink(client)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all text-center"
                >
                  <CreditCard className="size-4" /> Open Razorpay Gateway
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 font-medium">
                Register your project spec to activate automated Razorpay billing.
              </div>
            )}

            {/* Watermark Partner Badge */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              <span>Razorpay Automation</span>
              <span className="font-bold text-zinc-600 dark:text-zinc-400">Partnered by VLTMPL</span>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
