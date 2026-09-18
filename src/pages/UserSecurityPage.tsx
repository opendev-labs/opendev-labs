import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UserSecurityPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
        <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="size-6 text-emerald-500" /> Account Security & Permissions
        </h1>
        
        <div className="space-y-3 font-medium text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span>Unique User ID:</span>
            <span className="font-mono text-zinc-900 dark:text-white font-bold">{user?.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span>Security Protection:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Google OAuth 2.0 Encrypted
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span>Account Role:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">Standard User (Dashboard Locked)</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Agency Platform:</span>
            <span className="font-bold text-zinc-900 dark:text-white">OpenDev-Labs Agency Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserSecurityPage;
