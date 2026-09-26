import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Globe,
  Github,
  Save,
  CheckCircle2,
  Building2,
  ShieldCheck,
  ExternalLink,
  Key,
  Bot,
  Zap,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';
import { getOpenRouterKey, setOpenRouterKey } from '../services/openrouterService';
import { useAISupport } from '../context/AISupportContext';
import { useAuth } from '../context/AuthContext';

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { isAIEnabled, setAIEnabled } = useAISupport();

  const isDev = user?.role === 'developer';
  const [name, setName] = useState(user?.name || (isDev ? 'Yash Shirish Ramteke' : 'User'));
  const [email, setEmail] = useState(user?.email || (isDev ? 'opendev.office@gmail.com' : ''));
  const [phone, setPhone] = useState(user?.phoneNumber || (isDev ? '+91 81695 68582' : ''));
  const [github, setGithub] = useState((user as any)?.githubHandle ? `github.com/${(user as any).githubHandle}` : (isDev ? 'github.com/opendev-labs' : ''));
  const [website, setWebsite] = useState(isDev ? 'www.opendev-labs.com' : '');
  const [saved, setSaved] = useState(false);

  const [apiKey, setApiKey] = useState(getOpenRouterKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenRouterKey(apiKey);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans">
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
              Lead Owner Credentials
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <User className="size-7 text-white shrink-0" /> Lead Developer Profile & Contact Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
            Official contact details displayed across invoices, automated WhatsApp payment reminders, and sitemap schema.
          </p>
        </div>
      </motion.div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" /> Official contact details successfully updated!
        </div>
      )}

      {/* Admin OpenRouter API Key Configuration & AI Control Panel */}
      <div className="p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6 shadow-xs text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Key className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Admin AI Engine & API Key Configuration
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Only the admin manages the OpenRouter API Key. AI support is completely free for all website visitors & clients.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-200 dark:border-emerald-800">
            Admin Controlled
          </span>
        </div>

        {/* Global AI Chat Support ON/OFF Toggle */}
        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Bot className="size-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white block">
                24/7 AI Support Chat Widget (Website Global Toggle)
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Enable or disable floating AI chat widget across all website pages and client portals
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAIEnabled(!isAIEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
              isAIEnabled ? 'bg-blue-600 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'
            }`}
          >
            <motion.div
              layout
              className="size-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2">
          <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
            <span>OpenRouter API Key (`sk-or-v1-...`)</span>
            <span className="text-[10px] text-zinc-400 font-mono">Stored securely in admin browser storage</span>
          </label>

          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-or-v1-xxxxxxxxxxxxxxxx..."
              className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 font-mono text-xs rounded-xl flex-1"
            />
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs h-11 px-5 rounded-xl gap-2 shadow-xs"
            >
              <Save className="size-4" /> Save API Key
            </Button>
          </div>

          {apiKeySaved && (
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="size-4" /> OpenRouter API Key successfully saved!
            </p>
          )}
        </form>
      </div>

      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6 shadow-xs text-xs">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Lead Owner / Developer Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Work Email</label>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Phone / WhatsApp Number</label>
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">GitHub Organization</label>
            <Input
              value={github}
              onChange={e => setGithub(e.target.value)}
              className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-zinc-700 dark:text-zinc-300">Official Web Domain</label>
          <Input
            value={website}
            onChange={e => setWebsite(e.target.value)}
            className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs h-10 px-6 rounded-full gap-2 shadow-xs"
          >
            <Save className="size-4" /> Save Profile Details
          </Button>
        </div>
      </form>
    </div>
  );
};
