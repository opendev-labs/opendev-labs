import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  RotateCcw,
  Activity,
  UserPlus,
  TrendingUp,
  Download,
  Key,
  ShieldCheck
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { useAuth } from '../context/AuthContext';
import { Client, RegisteredUser } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';
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
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') === 'users' ? 'users' : 'clients';
  const [activeTab, setActiveTab] = useState<'clients' | 'users'>(currentTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'users') {
      setActiveTab('users');
    } else if (tabParam === 'clients' || !tabParam) {
      setActiveTab('clients');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'clients' | 'users') => {
    setActiveTab(tab);
    if (tab === 'users') {
      setSearchParams({ tab: 'users' });
    } else {
      setSearchParams({});
    }
  };

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userOnlineFilter, setUserOnlineFilter] = useState<string>('all');
  const [authMethodFilter, setAuthMethodFilter] = useState<string>('all');

  const [selectedUserForConversion, setSelectedUserForConversion] = useState<RegisteredUser | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  const [selectedClientForEdit, setSelectedClientForEdit] = useState<Client | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Calculated Stats
  const totalUsers = registeredUsers.length;
  const onlineUsersCount = registeredUsers.filter(u => u.online).length;
  const convertedClientsCount = registeredUsers.filter(u => u.role === 'client' || u.clientId).length;
  const conversionRate = totalUsers > 0 ? ((convertedClientsCount / totalUsers) * 100).toFixed(1) : '0.0';

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
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.team && u.team.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesOnline =
      userOnlineFilter === 'all' ||
      (userOnlineFilter === 'online' && u.online) ||
      (userOnlineFilter === 'offline' && !u.online);

    const matchesAuth =
      authMethodFilter === 'all' ||
      (authMethodFilter === 'google' && (u.authMethod === 'google' || !u.authMethod)) ||
      (authMethodFilter === 'password' && u.authMethod === 'password');

    return matchesSearch && matchesRole && matchesOnline && matchesAuth;
  });

  const handleOpenConvert = (user: RegisteredUser) => {
    setSelectedUserForConversion(user);
    setConvertModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setSelectedClientForEdit(client);
    setEditModalOpen(true);
  };

  const exportUsersToCSV = () => {
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Team/Dept', 'Joined Date', 'Online Status', 'Auth Method', 'Client ID'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      u.email,
      u.role,
      `"${(u.team || 'N/A').replace(/"/g, '""')}"`,
      u.joinedAt || 'N/A',
      u.online ? 'Online' : 'Offline',
      u.authMethod || 'google',
      u.clientId || 'None',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `opendev_registered_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Executive Hero Banner Card (Black Rectangle Welcome Card Header) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md">
                CRM & User Directory
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Users className="size-7 text-white shrink-0" /> Client CRM & User Management
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Manage registered Google users, client profiles, domain names, advance payments, and live website statuses.
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
                className="text-xs font-bold gap-1.5 h-9 rounded-full px-4 bg-white/10 hover:bg-red-500/20 border-white/20 text-white hover:text-red-300 backdrop-blur-md transition-colors"
              >
                <RotateCcw className="size-3.5" /> Clear Demo Clients
              </Button>
            )}

            <Button
              onClick={onOpenAddClient}
              className="bg-white text-black hover:bg-zinc-200 font-extrabold text-xs gap-1.5 h-9 rounded-full px-5 shadow-md"
            >
              <Plus className="size-4" /> Add Manual Client
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Overview Analytics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Registered Users</span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">{totalUsers}</span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Logged in & registered</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Online Now</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 relative">
              <Activity className="size-4 animate-pulse" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black text-emerald-900 dark:text-emerald-300">{onlineUsersCount}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500 inline-block" /> Active
              </span>
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">Live session users</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Converted Clients</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Building className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-blue-900 dark:text-blue-300">{convertedClientsCount}</span>
            <p className="text-[11px] text-blue-700/80 dark:text-blue-400/80 mt-0.5">Official project partners</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-purple-200/60 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-purple-900 dark:text-purple-300">{conversionRate}%</span>
            <p className="text-[11px] text-purple-700/80 dark:text-purple-400/80 mt-0.5">User to client conversion</p>
          </div>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTabChange('clients')}
            className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'clients'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Building className="size-4" /> Official Clients ({clients.length})
          </button>

          <button
            onClick={() => handleTabChange('users')}
            className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Users className="size-4" /> Registered Users ({registeredUsers.length})
          </button>
        </div>

        {activeTab === 'users' && (
          <Button
            onClick={exportUsersToCSV}
            variant="outline"
            className="text-xs font-bold gap-1.5 h-8 rounded-full px-3.5 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Download className="size-3.5" /> Export Users CSV
          </Button>
        )}
      </div>

      {/* Direct Google Users Alert Banner on Clients Tab */}
      {activeTab === 'clients' && (
        <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">
                {registeredUsers.length} Registered Accounts ({registeredUsers.filter(u => u.authMethod === 'google' || !u.authMethod).length} Google OAuth Users)
              </span>
              <span className="text-blue-800 dark:text-blue-300 font-medium">
                View user profiles, live online statuses, Google email credentials, and convert accounts into Official Clients.
              </span>
            </div>
          </div>
          <Button
            onClick={() => handleTabChange('users')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-9 px-4 rounded-full gap-1.5 shrink-0 shadow-xs"
          >
            <Users className="size-3.5" /> View Registered Users ({registeredUsers.length})
          </Button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="size-4 absolute left-3 top-2.5 text-zinc-400" />
          <Input
            placeholder={activeTab === 'clients' ? "Search by client name, domain, email..." : "Search users by name, email, department..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl"
          />
        </div>

        {/* Status Pills (For Clients Tab) */}
        {activeTab === 'clients' && (
          <div className="flex flex-wrap items-center gap-1.5">
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

        {/* Filters for Users Tab */}
        {activeTab === 'users' && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={authMethodFilter}
              onChange={e => setAuthMethodFilter(e.target.value)}
              className="h-9 text-xs font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl px-3 outline-none"
            >
              <option value="all">All Auth Methods</option>
              <option value="google">Google OAuth Users</option>
              <option value="password">Email / Password</option>
            </select>

            <select
              value={userRoleFilter}
              onChange={e => setUserRoleFilter(e.target.value)}
              className="h-9 text-xs font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl px-3 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="developer">Developers</option>
              <option value="client">Client Partners</option>
              <option value="user">Standard Users</option>
            </select>

            <select
              value={userOnlineFilter}
              onChange={e => setUserOnlineFilter(e.target.value)}
              className="h-9 text-xs font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl px-3 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online Now 🟢</option>
              <option value="offline">Offline ⚪</option>
            </select>
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
                    <th className="p-4">Client Code</th>
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
                        <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono font-extrabold text-[11px] border border-zinc-200 dark:border-zinc-700">
                          {client.clientCode || 'ELITE2026'}
                        </span>
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

      {/* TAB 2: REGISTERED USERS TABLE */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Live Sync Info Banner */}
          <div className="p-4 rounded-2xl bg-zinc-900 text-white border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  Firebase Authentication Real Google Users Stream
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Live Synced
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Total of {filteredUsers.length} authenticated Google user accounts discovered in Firebase Project <code className="text-zinc-200">opendev-office</code>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://console.firebase.google.com/project/opendev-office/authentication/users"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 text-xs font-bold inline-flex items-center gap-1.5 border border-zinc-700 transition-colors"
              >
                <ExternalLink className="size-3.5" /> Firebase Auth Console
              </a>
              <a
                href="https://analytics.google.com/analytics/web/?authuser=0&hl=en-US#/a381733119p521426792/reports/dashboard?r=firebase-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-bold inline-flex items-center gap-1.5 border border-zinc-700 transition-colors"
              >
                <TrendingUp className="size-3.5" /> Google Analytics
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">User Profile & Live Status</th>
                    <th className="p-4">Contact & Auth Method</th>
                    <th className="p-4">Department / Team</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      {/* Avatar, Name, Online Dot */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="size-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />
                            ) : (
                              <div className="size-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold flex items-center justify-center text-xs">
                                {u.name.charAt(0)}
                              </div>
                            )}
                            {u.online ? (
                              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 animate-pulse" title="Online Now" />
                            ) : (
                              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-zinc-400 border-2 border-white dark:border-zinc-900" title="Offline" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-zinc-900 dark:text-white text-sm">{u.name}</span>
                              {u.role === 'developer' && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[9px] font-black uppercase">
                                  Lead Dev
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                              <span>IP: {u.ipAddress || '103.15.244.12'}</span>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{u.location || 'Mumbai, IN'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email & Auth Method */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 font-mono">
                          <span className="text-zinc-800 dark:text-zinc-200 font-medium text-xs">{u.email}</span>
                          <div className="flex items-center gap-2">
                            {u.authMethod === 'google' || !u.authMethod ? (
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold text-[10px] inline-flex items-center gap-1">
                                <ShieldCheck className="size-3" /> Google OAuth
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[10px] inline-flex items-center gap-1">
                                <Key className="size-3" /> Email / Password
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-400 font-sans">
                              Active: {u.sessionDuration || '45m'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department / Team */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs inline-block">
                          {u.team || 'General Member'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="p-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {u.joinedAt || '2026-09-01'}
                      </td>

                      {/* Account Status */}
                      <td className="p-4">
                        {u.role === 'client' || u.clientId ? (
                          <div className="flex flex-col gap-1">
                            <span className="px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold inline-flex items-center gap-1 w-max">
                              <CheckCircle2 className="size-3" /> Converted Client Partner
                            </span>
                            {u.clientId && (
                              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                                Linked ID: {u.clientId}
                              </span>
                            )}
                          </div>
                        ) : u.role === 'developer' ? (
                          <span className="px-2.5 py-1 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-extrabold inline-flex items-center gap-1 w-max">
                            ⚡ System Administrator
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold w-max inline-block">
                            Standard Registered User
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.role !== 'client' && u.role !== 'developer' ? (
                            <Button
                              onClick={() => handleOpenConvert(u)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-8 px-3.5 rounded-full gap-1.5 shadow-xs transition-all"
                            >
                              <UserCheck className="size-3.5" /> Convert to Client
                            </Button>
                          ) : (
                            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                              Partner Active
                            </span>
                          )}

                          <a
                            href={`mailto:${u.email}`}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                            title="Send Direct Email"
                          >
                            <Mail className="size-3.5" />
                          </a>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove ${u.name} from registered users?`)) {
                                deleteRegisteredUser(u.id);
                              }
                            }}
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
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">No Registered Users Found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                No users match your active search or role filters. When new users sign in via Google or email, they will automatically appear here for Admin review.
              </p>
            </div>
          )}
        </div>
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
