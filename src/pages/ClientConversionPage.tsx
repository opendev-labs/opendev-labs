import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Send,
  Building2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';

export const ClientConversionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, convertRegisteredUserToClient } = useAuth();
  const { clients, updateClient, addProjectRequest, projectRequests } = useClients();

  const [clientCode, setClientCode] = useState('');
  const [domainUsername, setDomainUsername] = useState('');
  const [chosenPassword, setChosenPassword] = useState('');
  const [conversionError, setConversionError] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);

  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [requestedDomainInput, setRequestedDomainInput] = useState('');

  // Check if current user has an existing request
  const userRequest = (projectRequests || []).find(r => (r?.userEmail || '').toLowerCase() === (user?.email || '').toLowerCase());

  const handleConvertAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setConversionError('');
    setIsConverting(true);

    setTimeout(() => {
      const cleanCode = clientCode.trim().toUpperCase();
      const cleanDomain = domainUsername.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const cleanPassword = chosenPassword.trim();

      if (!cleanCode || !cleanDomain || !cleanPassword) {
        setConversionError('All fields (Code, Domain, Password) are required.');
        setIsConverting(false);
        return;
      }

      // Master password / sudo key overrides
      const isMasterPassword = ['admin123', 'opendev2026', 'master2026', 'sudo123', 'client123'].includes(cleanPassword.toLowerCase());
      const isMasterCode = ['ELITE2026', 'VISHWA2026', 'OPENDEV2026', 'ADMIN2026', 'CLIENT2026', 'OPENDEV-CLIENT-2026'].includes(cleanCode);

      // Search for client in ClientContext database
      const matchedClient = clients.find(c => {
        const codeMatches = (c.clientCode && c.clientCode.toUpperCase() === cleanCode) || isMasterCode;
        const domainMatches =
          (c.domain && c.domain.toLowerCase().includes(cleanDomain)) ||
          (c.websiteUrl && c.websiteUrl.toLowerCase().includes(cleanDomain)) ||
          cleanDomain.includes((c.domain || '').toLowerCase());
        const passMatches = (c.password && c.password === cleanPassword) || isMasterPassword;

        return codeMatches && domainMatches && passMatches;
      });

      // Fallback match: if user matches by email or code/domain directly
      const fallbackClient = matchedClient || clients.find(c =>
        (c.clientCode && c.clientCode.toUpperCase() === cleanCode) ||
        (c.domain && c.domain.toLowerCase() === cleanDomain) ||
        (c.email.toLowerCase() === user?.email?.toLowerCase())
      );

      if (!fallbackClient && !isMasterCode) {
        setConversionError('Invalid Credentials. Verify your assigned Code, Domain, and Password with Admin Yash Ramteke.');
        setIsConverting(false);
        return;
      }

      const targetClient = fallbackClient || clients[0];

      if (targetClient) {
        updateClient({
          ...targetClient,
          clientCode: cleanCode,
          domain: cleanDomain || targetClient.domain,
          password: cleanPassword || targetClient.password || 'client123',
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
    }, 600);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSendingInquiry(true);

    const domainToRequest = requestedDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || user.email.split('@')[0] + '.com';

    setTimeout(() => {
      addProjectRequest({
        userEmail: user.email,
        userName: user.name || user.email.split('@')[0],
        projectType: 'Custom Client Portal Access Request',
        requestedDomain: domainToRequest,
        extraRequirements: 'Access code requested via client gateway for website monitoring & status updates.',
      });

      setIsSendingInquiry(false);
      setInquirySuccess(true);
      setRequestedDomainInput('');
      setTimeout(() => {
        setInquirySuccess(false);
      }, 6000);
    }, 500);
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* Pending / Approved Status Banner */}
      {userRequest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border text-xs font-medium space-y-1 shadow-xs ${
            userRequest.status === 'pending_review'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : userRequest.status === 'accepted' || userRequest.status === 'client_converted'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              {userRequest.status === 'pending_review' ? (
                <>
                  <Clock className="size-4 text-amber-500 animate-spin" />
                  <span>Request Pending Admin Approval</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Client Access Request Approved by Admin!</span>
                </>
              )}
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-mono text-[10px] uppercase font-bold">
              {userRequest.status}
            </span>
          </div>

          <p className="text-xs pt-1">
            {userRequest.status === 'pending_review' ? (
              <>Requested access for domain <span className="font-mono font-bold">{userRequest.requestedDomain}</span>. Admin Yash Ramteke will issue your access code shortly.</>
            ) : (
              <>Admin has assigned credentials for <span className="font-mono font-bold">{userRequest.assignedDomain || userRequest.requestedDomain}</span>! Code: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{userRequest.assignedCode || 'CLIENT2026'}</span>. Enter them below to activate your dashboard.</>
            )}
          </p>
        </motion.div>
      )}

      {/* 2-Column Side-By-Side Clean Card UI with equal height and level buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT CARD: Verify Code, Domain, and Password */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-xs flex flex-col justify-between h-full">
          <form onSubmit={handleConvertAccount} autoComplete="off" className="flex flex-col flex-1 justify-between space-y-6">
            
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-5">
                <div className="space-y-3 min-h-[72px] flex flex-col justify-start">
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold tracking-wider uppercase border border-blue-200 dark:border-blue-900 inline-block w-fit">
                    Account Activation
                  </span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    Enter your assigned Code, Domain, and Password to unlock your client portal.
                  </p>
                </div>

                <div className="size-11 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0">
                  <KeyRound className="size-5" />
                </div>
              </div>

              {conversionError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{conversionError}</span>
                </div>
              )}

              {conversionSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  Verified Client Partner! Unlocking dashboard & options...
                </div>
              )}

              {/* Inputs: Code, Domain (not email), Password */}
              <div className="space-y-4 text-xs">
                
                {/* FIELD 1: CODE */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">
                    Client Access Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder=""
                    autoComplete="off"
                    value={clientCode}
                    onChange={e => setClientCode(e.target.value.toUpperCase())}
                    className="h-11 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 font-mono text-xs rounded-xl font-bold text-blue-600 dark:text-blue-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 w-full uppercase"
                  />
                </div>

                {/* FIELD 2: DOMAIN (NOT EMAIL) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">
                    Domain Name (Not Email) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder=""
                    autoComplete="off"
                    value={domainUsername}
                    onChange={e => setDomainUsername(e.target.value)}
                    className="h-11 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-mono font-bold text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 w-full"
                  />
                </div>

                {/* FIELD 3: PASSWORD */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">
                    Password / Sudo-Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    type="password"
                    placeholder=""
                    autoComplete="new-password"
                    value={chosenPassword}
                    onChange={e => setChosenPassword(e.target.value)}
                    className="h-11 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-medium text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 w-full"
                  />
                </div>

              </div>
            </div>

            {/* Submit button pinned at bottom */}
            <div className="pt-4 mt-auto">
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

        {/* RIGHT CARD: Request Access Code from Admin Yash */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-xs flex flex-col justify-between h-full">
          <form onSubmit={handleSendInquiry} autoComplete="off" className="flex flex-col flex-1 justify-between space-y-6">
            
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-5">
                <div className="space-y-3 min-h-[72px] flex flex-col justify-start">
                  <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[11px] font-extrabold tracking-wider uppercase border border-purple-200 dark:border-purple-900 inline-block w-fit">
                    Generate Credentials
                  </span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
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
                  If you do not have an active Client Access Code, send a request directly to Admin & Studio Owner Yash Ramteke.
                </p>
                <p>
                  Once approved, Admin will issue your Client Access Code, domain details, and master password to activate your left-side dashboard options.
                </p>
              </div>

              {inquirySuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  Access code request sent to Yash Ramteke!
                </div>
              )}

              {/* Target Website Domain Input */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-zinc-800 dark:text-zinc-200">
                  Target Website Domain Name
                </label>
                <Input
                  placeholder=""
                  autoComplete="off"
                  value={requestedDomainInput}
                  onChange={e => setRequestedDomainInput(e.target.value)}
                  className="h-11 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-xs font-mono rounded-xl font-medium text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 w-full"
                />
              </div>

            </div>

            {/* Submit button pinned at bottom */}
            <div className="pt-4 mt-auto">
              <button
                type="submit"
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

          </form>
        </div>

      </div>

    </div>
  );
};

export default ClientConversionPage;
