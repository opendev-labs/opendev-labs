import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  CircleDollarSign,
  Send,
  CheckCircle2,
  Clock,
  ReceiptText,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Globe,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';
import { openRazorpayCheckout, PREFERRED_UPI_ID, PREFERRED_UPI_NAME, RAZORPAY_KEY_ID } from '../lib/payment/razorpay';

export const ClientPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const paramPlan = searchParams.get('plan');
  const paramAmount = searchParams.get('amount');

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
  const [payMethod, setPayMethod] = useState<'Kotak Direct UPI' | 'GPay' | 'PhonePe' | 'Cash' | 'Bank Transfer / NEFT' | 'Razorpay'>('Kotak Direct UPI');
  const [payAmount, setPayAmount] = useState(paramAmount || (client ? client.monthlyFee.toString() : '4000'));
  const [payRef, setPayRef] = useState('');
  const [payNotifySuccess, setPayNotifySuccess] = useState(false);
  const [vpaCopied, setVpaCopied] = useState(false);

  useEffect(() => {
    if (paramAmount) {
      setPayAmount(paramAmount);
    }
  }, [paramAmount]);

  const handleCopyVPA = () => {
    navigator.clipboard.writeText(PREFERRED_UPI_ID);
    setVpaCopied(true);
    setTimeout(() => setVpaCopied(false), 2500);
  };

  const handleNotifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;

    notifyPayment({
      clientId: client?.id || `user-${user?.id || 'temp'}`,
      clientName: client?.name || user?.name || user?.email?.split('@')[0] || 'User',
      clientEmail: user?.email || client?.email || 'client@opendev-labs.com',
      amount: Number(payAmount),
      paymentMethod: payMethod as any,
      transactionRef: payRef,
    });

    setPayRef('');
    setPayNotifySuccess(true);
    setTimeout(() => setPayNotifySuccess(false), 4000);
  };

  const handleLaunchRazorpay = () => {
    const baseFee = client?.monthlyFee || Number(payAmount) || 4000;
    const feeWithGateway = Math.round(baseFee * 1.10); // 10% extra fee for Razorpay
    const curr = client?.currency || 'INR';

    openRazorpayCheckout({
      amount: feeWithGateway,
      currency: curr,
      name: user?.name || client?.name || 'Client Partner',
      email: user?.email || client?.email || 'opendev.office@gmail.com',
      description: `Monthly Retainer Payment - ${client?.domain || 'OpenDev Gateway'} (+10% Gateway Fee)`,
      onSuccess: (res) => {
        // Automatically notify developer when Razorpay live payment succeeds
        notifyPayment({
          clientId: client?.id || `user-${user?.id || 'temp'}`,
          clientName: client?.name || user?.name || 'Client',
          clientEmail: user?.email || client?.email || 'client@opendev-labs.com',
          amount: feeWithGateway,
          paymentMethod: 'Razorpay',
          transactionRef: `Razorpay Live Payment ID: ${res.razorpay_payment_id}`,
        });
        setPayNotifySuccess(true);
      },
    });
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

  const upiDeepLink = `upi://pay?pa=${PREFERRED_UPI_ID}&pn=${encodeURIComponent(PREFERRED_UPI_NAME)}&cu=INR`;

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
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md flex items-center gap-1">
                <Zap className="size-3 text-emerald-400" /> Domestic & International Payments
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="size-3 text-blue-400" /> Live Razorpay Enabled
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Payments & Retainer Gateway
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Pay via Preferred Direct UPI (<span className="font-mono text-emerald-400 font-bold">{PREFERRED_UPI_ID}</span>) or live automated Razorpay Checkout for international & domestic credit cards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {/* Preferred UPI Quick Pay Button */}
            <a
              href={upiDeepLink}
              className="px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Smartphone className="size-4" /> Pay via Kotak UPI
            </a>

            {/* Live Razorpay Checkout Button */}
            <button
              onClick={handleLaunchRazorpay}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <CreditCard className="size-4" /> Razorpay Live Checkout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Preferred UPI Card, Form & Notification History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PREFERRED DOMESTIC UPI PAYMENT CARD (Kotak Bank 8169568582@kotakbank) */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-5 shadow-sm relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-extrabold uppercase border border-emerald-500/30">
                    ★ Preferred Domestic Payment Method
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="size-5 text-emerald-600 dark:text-emerald-400" /> Direct India UPI (Kotak Bank)
                </h2>
              </div>

              <a
                href={upiDeepLink}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
              >
                <Smartphone className="size-3.5" /> Pay in GPay / PhonePe →
              </a>
            </div>

            {/* VPA Copy Box & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Box 1: VPA ID */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/20 space-y-2">
                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block">
                  Official India UPI VPA ID
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400 select-all">
                    {PREFERRED_UPI_ID}
                  </span>
                  <button
                    onClick={handleCopyVPA}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    title="Copy UPI VPA ID"
                  >
                    {vpaCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span>{vpaCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Pay directly via GPay, PhonePe, Paytm, BHIM, or any UPI app.
                </p>
              </div>

              {/* Box 2: Payee Details */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/20 space-y-2">
                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block">
                  Verified Account Beneficiary
                </span>
                <div className="space-y-1">
                  <span className="text-sm font-extrabold text-zinc-900 dark:text-white block">
                    {PREFERRED_UPI_NAME}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                    Official Mobile & WhatsApp Support: <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">+91 81695 68582</span>
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

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
                    Notify Developer of UPI / Cash / Bank Payment
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    Informed developer Yash Ramteke when you send funds via Kotak UPI, GPay, PhonePe, Cash, or Bank Transfer.
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
                    className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold"
                  >
                    <option value="Kotak Direct UPI">Kotak Direct UPI (8169568582@kotakbank)</option>
                    <option value="GPay">Google Pay (GPay)</option>
                    <option value="PhonePe">PhonePe / UPI</option>
                    <option value="Razorpay">Razorpay Live Online</option>
                    <option value="Cash">Cash in Hand</option>
                    <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
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
                    placeholder="e.g. UPI UTR 42918491823"
                    value={payRef}
                    onChange={e => setPayRef(e.target.value)}
                    className="h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto px-6 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                No payment notifications submitted yet. Use the form above to inform developer Yash Ramteke whenever you pay via UPI or Razorpay.
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
                          ⏳ Pending Verification
                        </span>
                      )}
                      {notif.status === 'confirmed' && (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                          ✅ Confirmed
                        </span>
                      )}
                      {notif.status === 'rejected' && (
                        <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 font-extrabold text-[10px] uppercase">
                          ❌ Failed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>

        {/* Right Column: Razorpay Live Gateway & Credentials */}
        <div className="space-y-6">
          
          {/* Razorpay Live Gateway Card */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-3xl border border-blue-500/30 dark:border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/20 space-y-5 shadow-sm relative overflow-hidden"
          >
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-extrabold uppercase border border-blue-500/30 inline-block">
                Razorpay Live Gateway Active
              </span>
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Globe className="size-5 text-blue-500" /> International & Domestic Online Cards
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                Accepts Visa, Mastercard, American Express, NetBanking, and International USD payments backed by official Razorpay Live Key.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-semibold">Live Key ID:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                  {RAZORPAY_KEY_ID}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-semibold">Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Live Production Mode
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLaunchRazorpay}
                className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <CreditCard className="size-4" /> Open Razorpay Live Checkout Modal
              </button>
            </div>

            {/* Watermark Partner Badge */}
            <div className="pt-3 border-t border-blue-500/20 flex items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              <span>Razorpay Live Suite</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">OpenDev Sovereign</span>
            </div>
          </motion.div>

          {/* Security & Authentication Info */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 shadow-xs text-xs"
          >
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>PCI-DSS Compliant Encryption</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px]">
              All card data & credentials are handled directly via Razorpay PCI-DSS certified TLS 1.3 servers.
            </p>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default ClientPaymentsPage;
