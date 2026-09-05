import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Globe,
  ExternalLink,
  Mail,
  Phone,
  Send,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  UserX,
  RefreshCw,
  Building,
  DollarSign
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { Client } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

interface ClientsManagerProps {
  onOpenAddClient: () => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({ onOpenAddClient }) => {
  const { clients, offboardClient, reactivateClient, deleteClient, getWhatsAppReminderUrl, markPaymentStatus } = useClients();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2">
            <Users className="size-6 text-black" /> Client CRM & Retainers
          </h1>
          <p className="text-xs text-zinc-600 mt-1 font-medium">
            Manage client profiles, monthly retainer fees, and offboarding status.
          </p>
        </div>

        <Button
          onClick={onOpenAddClient}
          className="bg-black hover:bg-zinc-800 text-white font-extrabold text-xs gap-1.5 h-9 rounded-full px-5 shadow-xs"
        >
          <Plus className="size-4" /> Add New Client
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3 top-2.5 text-zinc-400" />
          <Input
            placeholder="Search by name, company, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 rounded-xl"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'paid', 'pending', 'overdue', 'offboarded'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black'
              }`}
            >
              {st === 'all' ? 'All Clients' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Client & Company</th>
                <th className="p-4">Website Link</th>
                <th className="p-4">Engagement</th>
                <th className="p-4">Monthly Retainer</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-zinc-900 text-sm">{client.name}</span>
                      <span className="text-zinc-500 text-[11px] font-medium">{client.company}</span>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="size-3 text-zinc-400" /> {client.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="size-3 text-zinc-400" /> {client.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <a
                      href={client.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-black font-bold hover:underline"
                    >
                      <Globe className="size-3.5 text-zinc-500" />
                      <span className="truncate max-w-[150px]">{client.websiteUrl.replace('https://', '')}</span>
                      <ExternalLink className="size-3 text-zinc-400" />
                    </a>
                  </td>

                  <td className="p-4">
                    {client.billingType === 'monthly_retainer' ? (
                      <span className="px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-extrabold">
                        Monthly Retainer
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full border border-zinc-200 bg-zinc-100 text-zinc-600 text-[10px] font-extrabold">
                        One-Time Build
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-mono font-bold text-zinc-900">
                    {client.billingType === 'monthly_retainer' ? (
                      <span>{client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()}/mo</span>
                    ) : (
                      <span className="text-zinc-400 font-normal">N/A (Build Completed)</span>
                    )}
                  </td>

                  <td className="p-4">
                    {client.status === 'paid' && (
                      <span className="px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
                        PAID
                      </span>
                    )}
                    {client.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-extrabold">
                        PENDING
                      </span>
                    )}
                    {client.status === 'overdue' && (
                      <span className="px-2.5 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-[10px] font-extrabold">
                        OVERDUE
                      </span>
                    )}
                    {client.status === 'offboarded' && (
                      <span className="px-2.5 py-0.5 rounded-full border border-zinc-200 bg-zinc-100 text-zinc-500 text-[10px] font-extrabold">
                        OFFBOARDED
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={getWhatsAppReminderUrl(client)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-xs"
                        title="Send WhatsApp Reminder"
                      >
                        <Send className="size-3.5" />
                      </a>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7 text-zinc-500 hover:text-black">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-xs bg-white border-zinc-200 text-zinc-900 shadow-xl">
                          <DropdownMenuLabel className="text-zinc-500 font-bold">Client Options</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-zinc-100" />
                          <DropdownMenuItem onClick={() => markPaymentStatus(client.id, 'September 2026', 'paid')} className="hover:bg-zinc-100 font-medium">
                            <CheckCircle2 className="size-3.5 text-emerald-600 mr-2" /> Mark as Paid
                          </DropdownMenuItem>
                          {client.status !== 'offboarded' ? (
                            <DropdownMenuItem onClick={() => offboardClient(client.id)} className="text-amber-700 hover:bg-amber-50 font-medium">
                              <UserX className="size-3.5 mr-2" /> Offboard Client
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => reactivateClient(client.id)} className="text-black hover:bg-zinc-100 font-medium">
                              <RefreshCw className="size-3.5 mr-2" /> Reactivate Retainer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-zinc-100" />
                          <DropdownMenuItem onClick={() => deleteClient(client.id)} className="text-red-600 hover:bg-red-50 font-medium">
                            Delete Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
