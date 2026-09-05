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
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto text-zinc-900">
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2">
          <User className="size-6 text-black" /> Lead Developer Profile & Contact Settings
        </h1>
        <p className="text-xs text-zinc-600 mt-1 font-medium">
          Official contact details displayed across invoices, automated WhatsApp payment reminders, and sitemap schema.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" /> Official contact details successfully updated!
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-2xl border border-zinc-200 bg-white space-y-6 shadow-xs text-xs">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700">Lead Owner / Developer Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-11 bg-zinc-50 border-zinc-200 text-zinc-900 rounded-xl font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700">Work Email</label>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-11 bg-zinc-50 border-zinc-200 text-zinc-900 rounded-xl font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700">Official Phone / WhatsApp</label>
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="h-11 bg-zinc-50 border-zinc-200 text-zinc-900 rounded-xl font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700">GitHub Organization</label>
            <Input
              value={github}
              onChange={e => setGithub(e.target.value)}
              className="h-11 bg-zinc-50 border-zinc-200 text-zinc-900 rounded-xl font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="font-bold text-zinc-700">Official Agency Domain</label>
          <Input
            value={website}
            onChange={e => setWebsite(e.target.value)}
            className="h-11 bg-zinc-50 border-zinc-200 text-zinc-900 rounded-xl font-medium"
          />
        </div>

        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
          <a
            href="/iamyashramteke/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-black hover:underline flex items-center gap-1"
          >
            View Yash Ramteke Showcase <ExternalLink className="size-3.5" />
          </a>

          <Button type="submit" className="bg-black hover:bg-zinc-800 text-white font-extrabold text-xs h-10 rounded-full px-6 shadow-xs">
            <Save className="size-3.5 mr-1.5" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
