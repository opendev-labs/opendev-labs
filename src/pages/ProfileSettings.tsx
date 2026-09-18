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
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const ProfileSettings: React.FC = () => {
  const [name, setName] = useState('Yash Shirish Ramteke');
  const [email, setEmail] = useState('opendev.office@gmail.com');
  const [phone, setPhone] = useState('+91 81695 68582');
  const [github, setGithub] = useState('github.com/opendev-labs');
  const [website, setWebsite] = useState('www.opendev-labs.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
