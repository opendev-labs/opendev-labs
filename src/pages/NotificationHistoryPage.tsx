import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  CheckCircle2,
  CheckCheck,
  Trash2,
  Filter,
  Key,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Inbox,
  Send,
  UserCheck,
  Users,
  Megaphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const NotificationHistoryPage: React.FC = () => {
  const { user, registeredUsers = [] } = useAuth();
  const { notifications = [], markNotificationRead, sendNotification, projectRequests = [], clients = [] } = useClients();
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'payment' | 'request'>('all');
  const [localNotifications, setLocalNotifications] = useState(notifications || []);

  // Admin Broadcast Panel States
  const isAdmin = user?.role === 'developer';
  const [broadcastTargetType, setBroadcastTargetType] = useState<'all' | 'client' | 'user'>('all');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [newNotifType, setNewNotifType] = useState<'system' | 'payment' | 'request' | 'security'>('system');
  const [newNotifTitle, setNewNotifTitle] = useState('📢 Scheduled System Upgrade & Client Portal Maintenance');
  const [newNotifMessage, setNewNotifMessage] = useState('Notice to all clients: All web application updates and server responses are running optimally with 24/7 monitoring.');

  // Sync when context notifications change
  React.useEffect(() => {
    setLocalNotifications(notifications || []);
  }, [notifications]);

  // Compute user-specific notifications for Gmail logged in user
  const userEmail = user?.email?.toLowerCase().trim() || '';
  const userRequest = (projectRequests || []).find(r => (r?.userEmail || '').toLowerCase() === userEmail);
  const userClient = (clients || []).find(c => (c?.email || '').toLowerCase() === userEmail);

  // Generate dynamic user-facing notifications if user has pending/approved request or credentials
  const userDynamicNotifications = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      message: string;
      date: string;
      type: 'system' | 'payment' | 'request' | 'security';
      read: boolean;
    }> = [];

    // Default welcome notification for any logged-in user (FIRST ITEM)
    list.push({
      id: `dyn-welcome-${user?.id || 'guest'}`,
      title: `👋 Welcome to OpenDev-Labs Sovereign Portal!`,
      message: `Signed in as ${user?.name || 'Google User'} (${user?.email || 'Gmail'}). Access live project tracking, payments, security settings, and direct AI support.`,
      date: new Date().toISOString().split('T')[0],
      type: 'system',
      read: false,
    });

    if (userRequest) {
      if (userRequest.status === 'pending_review') {
        list.push({
          id: `dyn-req-pending-${userRequest.id}`,
          title: `Project Access Code Pending Review`,
          message: `Your request for ${userRequest.requestedDomain} has been submitted to Yash Ramteke. You will be notified here once approved.`,
          date: userRequest.createdAt || new Date().toISOString().split('T')[0],
          type: 'request',
          read: false,
        });
      } else if (userRequest.status === 'accepted' || userRequest.status === 'client_converted') {
        list.push({
          id: `dyn-req-approved-${userRequest.id}`,
          title: `Client Access Code Approved! 🎉`,
          message: `Admin issued Code: ${userRequest.assignedCode || 'CLIENT2026'} | Domain: ${userRequest.assignedDomain || userRequest.requestedDomain}. Enter these on the Client Portal Convert page.`,
          date: userRequest.createdAt || new Date().toISOString().split('T')[0],
          type: 'request',
          read: false,
        });
      }
    }

    if (userClient) {
      list.push({
        id: `dyn-client-active-${userClient.id}`,
        title: `Client Portal Activated for ${userClient.domain}`,
        message: `Your account is active. Next retainer payment of ₹${(userClient.monthlyFee || 4000).toLocaleString()} is due on ${userClient.nextPaymentDue || '2026-10-05'}.`,
        date: userClient.joinedDate || new Date().toISOString().split('T')[0],
        type: 'payment',
        read: true,
      });
    }

    return list;
  }, [userRequest, userClient, user]);

  // Combine store notifications with dynamic user notifications
  const allUserNotifications = React.useMemo(() => {
    const combined = [...(localNotifications || []), ...(userDynamicNotifications || [])];
    // Deduplicate by ID
    const seen = new Set<string>();
    return combined.filter(n => {
      if (!n || !n.id) return false;
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }, [localNotifications, userDynamicNotifications]);

  const filteredNotifications = allUserNotifications.filter(n => {
    if (!n) return false;

    // Non-admin user recipient targeting check
    if (!isAdmin) {
      const targetType = (n as any).targetType || 'all';
      const targetEmail = ((n as any).targetEmail || '').toLowerCase();
      const clientId = (n as any).clientId;

      if (targetType === 'user' && targetEmail && targetEmail !== userEmail) {
        return false;
      }
      if (targetType === 'client' && clientId && clientId !== userClient?.id && targetEmail !== userEmail) {
        return false;
      }
    }

    if (filter === 'unread') return !n.read;
    if (filter === 'system') return n.type === 'system';
    if (filter === 'payment') return n.type === 'payment';
    if (filter === 'request') return n.type === 'request';
    return true;
  });

  const unreadCount = allUserNotifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setLocalNotifications(prev => (prev || []).map(n => ({ ...n, read: true })));
    (notifications || []).forEach(n => n && n.id && markNotificationRead(n.id));
  };

  const handleClearAll = () => {
    setLocalNotifications([]);
  };

  const handleSendAdminNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim() || !newNotifMessage.trim()) {
      toast.error('Please fill in both title and message.');
      return;
    }

    let targetName = 'All Users & Clients';
    if (broadcastTargetType === 'client' && selectedTargetId) {
      const targetClient = clients.find(c => c.id === selectedTargetId);
      targetName = targetClient ? targetClient.name : selectedTargetId;
    } else if (broadcastTargetType === 'user' && selectedTargetId) {
      const targetUser = registeredUsers.find(u => u.email === selectedTargetId);
      targetName = targetUser ? targetUser.name : selectedTargetId;
    }

    sendNotification({
      title: newNotifTitle.trim(),
      message: newNotifMessage.trim(),
      type: newNotifType,
      targetType: broadcastTargetType,
      targetId: selectedTargetId || undefined,
      targetName,
    });

    toast.success(`⚡ Notification dispatched to ${targetName}!`);
    setNewNotifTitle('');
    setNewNotifMessage('');
    setSelectedTargetId('');
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <BellRing className="size-5" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Notification History</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold font-mono">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium pl-1">
            Real-time updates, access code assignments, billing notifications, and system logs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              className="h-9 px-3 text-xs font-bold rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5"
            >
              <CheckCheck className="size-4 text-emerald-500" />
              <span>Mark All Read</span>
            </Button>
          )}

          {localNotifications.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="h-9 px-3 text-xs font-bold rounded-xl border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5"
            >
              <Trash2 className="size-4" />
              <span>Clear List</span>
            </Button>
          )}
        </div>
      </div>

      {/* Admin Controller: Broadcast & Direct Notification Sender */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-blue-900/10 via-zinc-900/10 to-indigo-900/10 dark:from-blue-950/40 dark:via-zinc-900/60 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/80 p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Megaphone className="size-4" />
            </div>
            <h2 className="text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
              Admin Controller: Broadcast & Direct Notification Center
            </h2>
          </div>

          <form onSubmit={handleSendAdminNotification} className="space-y-4">
            {/* Target & Type Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Recipient Target
                </label>
                <select
                  value={broadcastTargetType}
                  onChange={(e) => {
                    setBroadcastTargetType(e.target.value as any);
                    setSelectedTargetId('');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">🌐 Broadcast to All (Clients & Users)</option>
                  <option value="client">🏢 Specific Client</option>
                  <option value="user">👤 Specific Registered User</option>
                </select>
              </div>

              {broadcastTargetType === 'client' && (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Select Target Client
                  </label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.domain})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {broadcastTargetType === 'user' && (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Select Target User
                  </label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Registered User --</option>
                    {registeredUsers.map(u => (
                      <option key={u.id} value={u.email}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Notification Category
                </label>
                <select
                  value={newNotifType}
                  onChange={(e) => setNewNotifType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="system">🔔 System Update</option>
                  <option value="payment">💳 Billing / Payment Alert</option>
                  <option value="request">🔑 Access Code Assignment</option>
                  <option value="security">🛡️ Security Notice</option>
                </select>
              </div>
            </div>

            {/* Title & Message inputs */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Notification Title (e.g. Scheduled System Upgrade or Payment Confirmation)"
                value={newNotifTitle}
                onChange={(e) => setNewNotifTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Write message details for recipient..."
                value={newNotifMessage}
                onChange={(e) => setNewNotifMessage(e.target.value)}
                rows={2}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 h-9 rounded-xl flex items-center gap-1.5"
              >
                <Send className="size-3.5" />
                <span>Dispatch Notification →</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: 'All Updates' },
              { id: 'unread', label: 'Unread', badge: unreadCount },
              { id: 'request', label: 'Access Codes' },
              { id: 'payment', label: 'Payments' },
              { id: 'system', label: 'System Logs' },
            ] as Array<{ id: 'all' | 'unread' | 'system' | 'payment' | 'request'; label: string; badge?: number }>
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === tab.id
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  filter === tab.id ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black' : 'bg-red-500 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Notification Items List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notif, idx) => {
            if (!notif) return null;
            const isRead = !!notif.read;
            const type = notif.type || 'system';
            const title = notif.title || 'System Notification';
            const message = notif.message || (notif as any).content || 'No details provided.';
            const date = notif.date || (notif as any).timestamp || new Date().toISOString().split('T')[0];
            const id = notif.id || `notif-${idx}`;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  !isRead
                    ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800'
                }`}
              >
                {/* Type Icon */}
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  type === 'request'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    : type === 'payment'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : type === 'security'
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                }`}>
                  {type === 'request' ? (
                    <Key className="size-5" />
                  ) : type === 'payment' ? (
                    <CreditCard className="size-5" />
                  ) : type === 'security' ? (
                    <ShieldCheck className="size-5" />
                  ) : (
                    <Bell className="size-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                      <span>{title}</span>
                      {!isRead && (
                        <span className="size-2 rounded-full bg-blue-500 inline-block shrink-0 animate-pulse" />
                      )}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 shrink-0">
                      <Clock className="size-3.5" />
                      <span>{date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                    {message}
                  </p>

                  {/* Actions for specific notification types */}
                  <div className="pt-1 flex items-center gap-3">
                    {notif.type === 'request' && (
                      <Link
                        to="/client/convert"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Activate Account in Convert Page</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    )}

                    {notif.type === 'payment' && (
                      <Link
                        to="/client/portal"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <span>View Client Dashboard</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    )}

                    {!isRead && (
                      <button
                        onClick={() => {
                          setLocalNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                          markNotificationRead(notif.id);
                        }}
                        className="text-[11px] font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl space-y-3">
            <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Inbox className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No notifications found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                You have no notifications matching the selected filter.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default NotificationHistoryPage;
