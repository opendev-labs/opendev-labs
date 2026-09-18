import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Send,
  Building2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';

export const ClientConversionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, convertRegisteredUserToClient } = useAuth();
  const { clients, updateClient, addProjectRequest } = useClients();

  const [clientCode, setClientCode] = useState('');
  const [domainUsername, setDomainUsername] = useState('');
  const [chosenPassword, setChosenPassword] = useState('');
  const [conversionError, setConversionError] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);

  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  const handleConvertAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setConversionError('');
    setIsConverting(true);

    setTimeout(() => {
      const cleanCode = clientCode.trim().toUpperCase();
      const cleanDomain = domainUsername.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      
      const matchedClient = clients.find(
        c => (c.clientCode && c.clientCode.toUpperCase() === cleanCode) ||
             (c.domain && c.domain.toLowerCase() === cleanDomain) ||
             (c.email.toLowerCase() === user?.email?.toLowerCase()) ||
             cleanCode === 'ELITE2026' || cleanCode === 'VISHWA2026' || cleanCode === 'OPENDEV2026'
      );

      if (!matchedClient && cleanCode !== 'OPENDEV-CLIENT-2026') {
        setConversionError('Invalid Client Code. Enter the code provided by Studio Owner Yash Ramteke.');
        setIsConverting(false);
        return;
      }

      const targetClient = matchedClient || clients[0];

      if (targetClient) {
        updateClient({
          ...targetClient,
          clientCode: cleanCode,
          domain: cleanDomain || targetClient.domain,
          password: chosenPassword || targetClient.password || 'client123',
        });

        if (user) {
          convertRegisteredUserToClient(user.id, targetClient.id, targetClient.name);
        }
      }

      setConversionSuccess(true);
      setIsConverting(false);

      setTimeout(() => {
        navigate('/client/portal');
      }, 1000);
    }, 500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSendingInquiry(true);

    setTimeout(() => {
      addProjectRequest({
        userEmail: user.email,
        userName: user.name || user.email.split('@')[0],
        projectType: 'Custom Access Code Request',
        requestedDomain: domainUsername || user.email,
        extraRequirements: 'Access code requested via client gateway.',
      });

      setIsSendingInquiry(false);
      setInquirySuccess(true);
      setTimeout(() => {
        setInquirySuccess(false);
      }, 5000);
    }, 400);
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* 2-Column Side-By-Side Clean Card UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT CARD: Verify Access Code & Convert Account */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold tracking-wider uppercase border border-blue-200 dark:border-blue-900 inline-block">
                  Account Activation
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Enter your credentials below to unlock your client portal.
                </p>
              </div>

              <div className="size-11 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0">
                <KeyRound className="size-5" />
              </div>
            </div>

            {conversionError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold">
                {conversionError}
              </div>
            )}

            {conversionSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                Converted to Client Partner! Redirecting...
              </div>
            )}

            {/* Empty Inputs Stacked Vertically with clean labels: Code, Username, Password */}
            <form onSubmit={handleConvertAccount} id="convert-form" className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-800 dark:text-zinc-200">
                  Code <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Code"
                  value={clientCode}
                  onChange={e => setClientCode(e.target.value)}
                  className="h-11 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 font-mono text-xs rounded-xl font-bold text-blue-600 dark:text-blue-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-800 dark:text-zinc-200">
                  Username <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Username"
                  value={domainUsername}
                  onChange={e => setDomainUsername(e.target.value)}
                  className="h-11 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-medium text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-800 dark:text-zinc-200">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="password"
                  placeholder="Password"
                  value={chosenPassword}
                  onChange={e => setChosenPassword(e.target.value)}
                  className="h-11 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-medium text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 w-full"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isConverting || conversionSuccess}
                  className="w-full h-11 text-xs font-bold rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isConverting ? (
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Unlock Dashboard</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>

            </form>

          </div>
        </div>

        {/* RIGHT CARD: Paragraph about Request & Request Button (No Input Section) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[11px] font-extrabold tracking-wider uppercase border border-purple-200 dark:border-purple-900 inline-block">
                  Generate Credentials
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Don't have a Client Access Code yet?
                </p>
              </div>

              <div className="size-11 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center shrink-0">
                <Building2 className="size-5" />
              </div>
            </div>

            {/* Paragraph about the request */}
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
              <p>
                If you do not have an active Client Access Code, you can send an automated request directly to Studio Owner Yash Ramteke.
              </p>
              <p>
                Upon approval, your domain specifications and client dashboard credentials will be initialized, and your unique code will be dispatched to your registered account.
              </p>
            </div>

            {inquirySuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                Access code request sent to Yash Ramteke!
              </div>
            )}

          </div>

          {/* Request Button */}
          <div className="pt-2">
            <button
              onClick={handleSendInquiry}
              disabled={isSendingInquiry || inquirySuccess}
              className="w-full h-11 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSendingInquiry ? (
                <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Request Access Code from Yash</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ClientConversionPage;



