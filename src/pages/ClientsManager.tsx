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
  DollarSign,
  UserCheck,
  Sparkles,
  ShieldAlert,
  Trash2,
  Edit,
  RotateCcw
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { useAuth } from '../context/AuthContext';
import { Client, RegisteredUser } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { ConvertUserModal } from '../components/modals/ConvertUserModal';
import { EditClientModal } from '../components/modals/EditClientModal';
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
  const { clients, offboardClient, reactivateClient, deleteClient, clearAllClients, getWhatsAppReminderUrl, markPaymentStatus } = useClients();
  const { registeredUsers, deleteRegisteredUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'clients' | 'users'>('clients');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedUserForConversion, setSelectedUserForConversion] = useState<RegisteredUser | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  const [selectedClientForEdit, setSelectedClientForEdit] = useState<Client | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.domain && c.domain.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter || c.websiteStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = registeredUsers.filter(u => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleOpenConvert = (user: RegisteredUser) => {
    setSelectedUserForConversion(user);
    setConvertModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setSelectedClientForEdit(client);
    setEditModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Users className="size-6 text-black dark:text-white" /> Client CRM & Project Status
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
            Manage client profiles, domain names, advance payments, and live website status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {clients.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all demo clients for a blank dashboard start? You can add clients manually anytime.')) {
                  clearAllClients();
                }
              }}
              className="text-xs font-bold gap-1.5 h-9 rounded-full px-4 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600"
            >
              <RotateCcw className="size-3.5" /> Clear Demo Clients
            </Button>
          )}

          <Button
            onClick={onOpenAddClient}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs gap-1.5 h-9 rounded-full px-5 shadow-xs"
          >
            <Plus className="size-4" /> Add Manual Client
          </Button>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1">
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all flex items-center gap-2 ${
            activeTab === 'clients'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Building className="size-4" /> Official Clients ({clients.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Users className="size-4" /> Registered Users ({registeredUsers.length})
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3 top-2.5 text-zinc-400" />
          <Input
            placeholder={activeTab === 'clients' ? "Search by client name, domain, email..." : "Search users by name, email..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl"
          />
        </div>

        {/* Status Pills (Only for clients tab) */}
        {activeTab === 'clients' && (
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Clients' },
              { id: 'under-development', label: 'Under Development' },
              { id: 'under-maintenance', label: 'Under Maintenance' },
              { id: 'completed', label: 'Completed' },
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  statusFilter === st.id
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: OFFICIAL CLIENTS TABLE */}
      {activeTab === 'clients' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
          {filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Client Name & Details</th>
                    <th className="p-4">Domain Name</th>
                    <th className="p-4">Website Project Status</th>
                    <th className="p-4">Advance Paid</th>
                    <th className="p-4">Monthly Retainer</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-zinc-900 dark:text-white text-sm">{client.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-medium">{client.company}</span>
                          <div className="flex items-center gap-3 text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                            <span>{client.email}</span>
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <a
                          href={client.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-black dark:text-white font-mono font-bold hover:underline"
                        >
                          <Globe className="size-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate max-w-[160px]">
                            {client.domain || client.websiteUrl.replace(/^https?:\/\//, '')}
                          </span>
                          <ExternalLink className="size-3 text-zinc-400 shrink-0" />
                        </a>
                      </td>

                      <td className="p-4">
                        {client.websiteStatus === 'under-development' && (
                          <span className="px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold inline-flex items-center gap-1">
                            🔨 Under Development
                          </span>
                        )}
                        {client.websiteStatus === 'under-maintenance' && (
                          <span className="px-2.5 py-1 rounded-full border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-extrabold inline-flex items-center gap-1">
                            🛠️ Under Maintenance
                          </span>
                        )}
                        {client.websiteStatus === 'completed' && (
                          <span className="px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold inline-flex items-center gap-1">
                            ✅ Completed (No Retainer)
                          </span>
                        )}
                        {!client.websiteStatus && (
                          <span className="px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold">
                            Active Project
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {client.advancePaid ? (
                          <span className="px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold inline-flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Paid {client.advanceAmount ? `(₹${client.advanceAmount.toLocaleString()})` : ''}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-[10px] font-extrabold">
                            Advance Pending
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono font-bold text-zinc-900 dark:text-white">
                        {client.billingType === 'monthly_retainer' && client.monthlyFee > 0 ? (
                          <span>{client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()}/mo</span>
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-500 font-normal">N/A</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(client)}
                            className="h-8 px-2.5 text-xs font-bold border-zinc-300 dark:border-zinc-700 gap-1 rounded-lg"
                          >
                            <Edit className="size-3.5" /> Edit
                          </Button>

                          <a
                            href={getWhatsAppReminderUrl(client)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 transition-colors shadow-xs"
                            title="Send WhatsApp Reminder"
                          >
                            <Send className="size-3.5" />
                          </a>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xl">
                              <DropdownMenuLabel className="text-zinc-500 dark:text-zinc-400 font-bold">Client Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                              <DropdownMenuItem onClick={() => handleOpenEdit(client)} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium">
                                <Edit className="size-3.5 mr-2 text-zinc-600 dark:text-zinc-300" /> Edit Profile & Status
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => markPaymentStatus(client.id, 'September 2026', 'paid')} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium">
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Mark Retainer Paid
                              </DropdownMenuItem>
                              {client.status !== 'offboarded' ? (
                                <DropdownMenuItem onClick={() => offboardClient(client.id)} className="text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-medium">
                                  <UserX className="size-3.5 mr-2" /> Offboard Client
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => reactivateClient(client.id)} className="text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium">
                                  <RefreshCw className="size-3.5 mr-2" /> Reactivate Retainer
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                              <DropdownMenuItem onClick={() => deleteClient(client.id)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium">
                                Delete Client Record
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
          ) : (
            <div className="p-12 text-center space-y-4">
              <Building className="size-10 mx-auto text-zinc-400" />
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Admin Dashboard Clean Start</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                No active clients in database. You can manually add clients or convert registered Google users into client partners.
              </p>
              <Button
                onClick={onOpenAddClient}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs rounded-full px-6 py-2 shadow-sm"
              >
                + Add First Client Manually
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REGISTERED GOOGLE USERS TABLE */}
      {activeTab === 'users' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">User & Avatar</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Date Joined</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="size-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />
                          ) : (
                            <div className="size-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold flex items-center justify-center text-xs">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-extrabold text-zinc-900 dark:text-white text-sm">{u.name}</span>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-medium text-zinc-600 dark:text-zinc-300">
                        {u.email}
                      </td>

                      <td className="p-4 font-mono text-zinc-500 dark:text-zinc-400">
                        {u.joinedAt || '2026-09-07'}
                      </td>

                      <td className="p-4">
                        {u.role === 'client' ? (
                          <span className="px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1 w-max">
                            <CheckCircle2 className="size-3" /> Converted Client Partner
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold w-max block">
                            Standard Registered User
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.role !== 'client' ? (
                            <Button
                              onClick={() => handleOpenConvert(u)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-8 px-4 rounded-full gap-1.5 shadow-xs transition-all"
                            >
                              <UserCheck className="size-3.5" /> Convert to Client
                            </Button>
                          ) : (
                            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                              Linked: {u.clientId}
                            </span>
                          )}

                          <button
                            onClick={() => deleteRegisteredUser(u.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Remove User Record"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <Users className="size-8 mx-auto text-zinc-400" />
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">No Registered Users Yet</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                When new users sign in via Google or email, they will automatically appear here for Admin to convert into Official Client Partners.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Convert User Modal */}
      <ConvertUserModal
        userToConvert={selectedUserForConversion}
        open={convertModalOpen}
        onOpenChange={setConvertModalOpen}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        clientToEdit={selectedClientForEdit}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </div>
  );
};
