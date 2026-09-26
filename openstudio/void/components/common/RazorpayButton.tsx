import React from 'react';
import { motion } from 'framer-motion';
import { openRazorpayCheckout } from '../../../lib/payment/razorpay';

interface RazorpayButtonProps {
  amount?: number;
  label?: string;
  onSuccess?: (response: any) => void;
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount = 500,
  label = "Support opendev-labs",
  onSuccess
}) => {
  const handlePayment = () => {
    openRazorpayCheckout({
      amount: amount,
      currency: 'INR',
      description: `Support OpenDev-Labs - ${label}`,
      onSuccess: (res) => {
        if (onSuccess) onSuccess(res);
      }
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePayment}
      className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-none transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col items-start">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 mb-0.5">Premium Support</span>
        <span className="text-sm font-black uppercase tracking-tight">{label}</span>
      </div>

      <div className="ml-4 h-8 w-[1px] bg-zinc-800 group-hover:bg-zinc-200 transition-colors" />

      <div className="flex items-center gap-2">
        <span className="text-xl font-bold italic text-red-500 group-hover:text-black">₹{amount}</span>
      </div>

      {/* Razorpay branding text */}
      <div className="absolute bottom-1 right-2 opacity-20 pointer-events-none">
        <span className="text-[6px] font-bold tracking-tighter uppercase">Powered by Razorpay Live</span>
      </div>
    </motion.button>
  );
};
