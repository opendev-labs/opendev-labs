import React, { useState } from 'react';
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
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <User className="size-6 text-black dark:text-white" /> Lead Developer Profile & Contact Settings
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
          Official contact details displayed across invoices, automated WhatsApp payment reminders, and sitemap schema.
        </p>
      </div>

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
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Official Phone / WhatsApp</label>
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

        <div className="space-y-1.5 pt-2">
          <label className="font-bold text-zinc-700 dark:text-zinc-300">Official Agency Domain</label>
          <Input
            value={website}
            onChange={e => setWebsite(e.target.value)}
            className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
          />
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <a
            href="/iamyashramteke/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1"
          >
            View Yash Ramteke Showcase <ExternalLink className="size-3.5" />
          </a>

          <Button type="submit" className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs h-10 rounded-full px-6 shadow-xs">
            <Save className="size-3.5 mr-1.5" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
