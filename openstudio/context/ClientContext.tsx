import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, PaymentRecord, Invoice, MaintenanceTicket, NotificationItem, ProjectRequest, ChangelogItem, PaymentNotification, CustomAgent } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

interface ClientContextType {
  clients: Client[];
  payments: PaymentRecord[];
  invoices: Invoice[];
  tickets: MaintenanceTicket[];
  notifications: NotificationItem[];
  projectRequests: ProjectRequest[];
  changelogs: ChangelogItem[];
  paymentNotifications: PaymentNotification[];
  customAgents: CustomAgent[];
  addClient: (client: Omit<Client, 'id' | 'joinedDate'>) => Client;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  clearAllClients: () => void;
  markPaymentStatus: (clientId: string, month: string, status: 'paid' | 'pending' | 'overdue') => void;
  offboardClient: (clientId: string) => void;
  reactivateClient: (clientId: string) => void;
  addTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>) => void;
  updateTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => void;
  generateInvoice: (clientId: string) => void;
  markNotificationRead: (id: string) => void;
  sendNotification: (payload: {
    title: string;
    message: string;
    type?: 'reminder' | 'payment' | 'ticket' | 'system' | 'request' | 'security';
    targetType?: 'all' | 'client' | 'user';
    targetId?: string;
    targetName?: string;
  }) => void;
  getWhatsAppReminderUrl: (client: Client) => string;
  getRazorpayLink: (client: Client) => string;
  addProjectRequest: (req: Omit<ProjectRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateProjectRequestStatus: (id: string, status: ProjectRequest['status']) => void;
  approveProjectRequest: (id: string, code: string, domain: string, password?: string) => void;
  rejectProjectRequest: (id: string) => void;
  deleteProjectRequest: (id: string) => void;
  generateClientCredentials: (data: {
    name: string;
    email: string;
    domain: string;
    clientCode: string;
    password?: string;
    monthlyFee?: number;
    company?: string;
    workStatus?: 'waiting_for_approval' | 'work_started' | 'in_progress' | 'testing_preview' | 'completed';
    progressPercentage?: number;
    advancePaid?: boolean;
    advanceAmount?: number;
    totalBill?: number;
    livePreviewUrl?: string;
    devPreviewUrl?: string;
    maintenanceStatus?: 'paid' | 'need_to_pay' | 'no_retainer';
    domainStatus?: 'active' | 'pending_dns' | 'expired' | 'registered';
  }) => void;
  addChangelog: (item: Omit<ChangelogItem, 'id' | 'date'>) => void;
  deleteChangelog: (id: string) => void;
  notifyPayment: (data: Omit<PaymentNotification, 'id' | 'date' | 'status'>) => void;
  confirmPaymentNotification: (id: string) => void;
  rejectPaymentNotification: (id: string) => void;
}

const INITIAL_CLIENTS: Client[] = [];

const INITIAL_CUSTOM_AGENTS: CustomAgent[] = [
  {
    id: 'agent-1',
    name: 'QBET Trading Execution Agent',
    model: 'Gemini 1.5 Pro',
    projectKey: 'qbet-trading',
    targetDomain: 'elite-tradinghub.com',
    status: 'active',
    requests24h: 18450,
    latencyMs: 32,
    accuracyRate: '99.4%',
    description: 'Executes sub-second orderbook risk checks and automated stop-loss adjustments.',
    lastTrained: '2026-09-08 14:30',
  },
  {
    id: 'agent-2',
    name: 'VishwaLead Intelligence Bot',
    model: 'Gemini 1.5 Flash',
    projectKey: 'vishwa-ai',
    targetDomain: 'vishwaleadr.com',
    status: 'active',
    requests24h: 12100,
    latencyMs: 45,
    accuracyRate: '98.9%',
    description: 'Summarizes global leadership news, extracts entity sentiment, and auto-posts feeds.',
    lastTrained: '2026-09-09 09:15',
  },
  {
    id: 'agent-3',
    name: 'AgentBash Infrastructure Agent',
    model: 'Gemini 2.0 Flash',
    projectKey: 'agentbash-core',
    targetDomain: 'opendev-labs.com',
    status: 'active',
    requests24h: 39200,
    latencyMs: 18,
    accuracyRate: '99.8%',
    description: 'Autonomous POSIX bash script generation, AST validation, and auto-healing runner.',
    lastTrained: '2026-09-09 17:00',
  }
];

const INITIAL_PAYMENTS: PaymentRecord[] = [];
const INITIAL_INVOICES: Invoice[] = [];
const INITIAL_TICKETS: MaintenanceTicket[] = [];
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'welcome-notification-1',
    title: '👋 Welcome to OpenDev-Labs Sovereign Portal!',
    message: 'Welcome to your OpenDev-Labs Client Gateway! Access live project tracking, payments, security settings, and direct AI support.',
    date: '2026-09-20',
    read: false,
    type: 'system',
    targetType: 'all',
  },
  {
    id: 'admin-broadcast-example-2',
    title: '📢 Admin Announcement Example: 24/7 Monitoring Active',
    message: 'Admin Notice Example: All client web applications, database snapshots, and retainer services are active with 99.9% uptime monitoring.',
    date: '2026-09-20',
    read: false,
    type: 'system',
    targetType: 'all',
  }
];
const INITIAL_PROJECT_REQUESTS: ProjectRequest[] = [
  {
    id: 'req-1',
    userEmail: 'afwank768@gmail.com',
    userName: 'Afwan Khan',
    projectType: 'Custom Client Portal Request',
    requestedDomain: 'afwan-tech.com',
    extraRequirements: 'Needs website status monitoring, retainer invoice receipts & priority support.',
    createdAt: '2026-09-18',
    status: 'pending_review',
  },
  {
    id: 'req-2',
    userEmail: 'vtxcy22@gmail.com',
    userName: 'VTXCY Member',
    projectType: 'E-Commerce Access Code Request',
    requestedDomain: 'vtxcy-store.com',
    extraRequirements: 'Client access code request for retail dashboard & webhook alerts.',
    createdAt: '2026-09-17',
    status: 'pending_review',
  },
  {
    id: 'req-3',
    userEmail: 'faizanhd5@gmail.com',
    userName: 'Faizan HD',
    projectType: 'Web Portal Gateway Request',
    requestedDomain: 'faizan-media.io',
    extraRequirements: 'Access code for high-traffic media agency retainer portal.',
    createdAt: '2026-09-15',
    status: 'accepted',
    assignedCode: 'FAIZAN2026',
    assignedDomain: 'faizan-media.io',
    assignedPassword: 'client123',
  }
];
const INITIAL_CHANGELOGS: ChangelogItem[] = [];
const INITIAL_PAYMENT_NOTIFICATIONS: PaymentNotification[] = [];

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    // Wipe all legacy client local storage caches completely
    ['opendev_clients_v1', 'opendev_clients_v2', 'opendev_clients_v3', 'opendev_clients_v4', 'opendev_clients_v5', 'opendev_clients_v6', 'opendev_clients_v7', 'opendev_clients_v8', 'opendev_clients_v9'].forEach(k => localStorage.removeItem(k));
    return [];
  });

  const [customAgents] = useState<CustomAgent[]>(INITIAL_CUSTOM_AGENTS);

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('opendev_payments_v5');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('opendev_invoices_v5');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('opendev_tickets_v5');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('opendev_notifications_v6');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>(() => {
    const saved = localStorage.getItem('opendev_project_requests_v1');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_REQUESTS;
  });

  const [changelogs, setChangelogs] = useState<ChangelogItem[]>(() => {
    const saved = localStorage.getItem('opendev_changelogs_v1');
    return saved ? JSON.parse(saved) : INITIAL_CHANGELOGS;
  });

  const [paymentNotifications, setPaymentNotifications] = useState<PaymentNotification[]>(() => {
    const saved = localStorage.getItem('opendev_payment_notifications_v1');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_NOTIFICATIONS;
  });

  // 1. Real-time Firestore Clients Listener
  useEffect(() => {
    if (!db) return;

    const unsubClients = onSnapshot(collection(db, "clients"), async (snapshot) => {
      if (snapshot.empty) {
        setClients([]);
        return;
      }

      const firestoreClients: Client[] = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Client, 'id'>)
      }));

      setClients(firestoreClients);
    }, (err) => {
      console.warn("Clients onSnapshot error:", err);
    });

    const unsubPayments = onSnapshot(collection(db, "payments"), (snapshot) => {
      if (!snapshot.empty) {
        const firestorePayments: PaymentRecord[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<PaymentRecord, 'id'>)
        }));
        setPayments(firestorePayments);
      }
    }, (err) => {
      console.warn("Payments onSnapshot error:", err);
    });

    const unsubNotifs = onSnapshot(collection(db, "notifications"), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreNotifs: NotificationItem[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<NotificationItem, 'id'>)
        }));
        firestoreNotifs.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setNotifications(prev => {
          const combined = [...firestoreNotifs, ...prev];
          const seen = new Set<string>();
          return combined.filter(n => {
            if (!n || !n.id || seen.has(n.id)) return false;
            seen.add(n.id);
            return true;
          });
        });
      }
    }, (err) => {
      console.warn("Notifications onSnapshot error:", err);
    });

    return () => {
      unsubClients();
      unsubPayments();
      unsubNotifs();
    };
  }, []);

  // Local Storage Backups
  useEffect(() => {
    localStorage.setItem('opendev_clients_v9', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('opendev_payments_v5', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('opendev_invoices_v5', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('opendev_tickets_v5', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('opendev_notifications_v5', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('opendev_payment_notifications_v1', JSON.stringify(paymentNotifications));
  }, [paymentNotifications]);

  const addClient = (clientData: Omit<Client, 'id' | 'joinedDate'>): Client => {
    const newId = `client-${Date.now()}`;
    const newClient: Client = {
      ...clientData,
      id: newId,
      joinedDate: new Date().toISOString().split('T')[0],
      razorpayPaymentLink: clientData.razorpayPaymentLink || `https://rzp.io/l/opendev-${clientData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    };

    setClients(prev => [...prev, newClient]);

    if (db) {
      setDoc(doc(db, "clients", newId), newClient).catch(err => {
        console.warn("Error adding client to Firestore:", err);
      });
    }

    return newClient;
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => (c.id === updatedClient.id ? updatedClient : c)));

    if (db) {
      setDoc(doc(db, "clients", updatedClient.id), updatedClient, { merge: true }).catch(err => {
        console.warn("Error updating client in Firestore:", err);
      });
    }
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));

    if (db) {
      deleteDoc(doc(db, "clients", id)).catch(err => {
        console.warn("Error deleting client from Firestore:", err);
      });
    }
  };

  const clearAllClients = () => {
    clients.forEach(c => {
      if (db) deleteDoc(doc(db, "clients", c.id)).catch(() => {});
    });
    setClients([]);
  };

  const markPaymentStatus = (clientId: string, month: string, status: 'paid' | 'pending' | 'overdue') => {
    const client = clients.find(c => c.id === clientId);
    const payStatus = status === 'paid' ? 'paid' : status === 'overdue' ? 'overdue' : 'pending';

    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            status: payStatus,
          };
        }
        return c;
      })
    );

    if (db && client) {
      setDoc(doc(db, "clients", clientId), { status: payStatus }, { merge: true }).catch(() => {});
    }

    const payId = `pay-${clientId}-${month.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const paymentRecord: PaymentRecord = {
      id: payId,
      clientId,
      clientName: client?.name || 'Client',
      month,
      amount: client?.monthlyFee || 4000,
      dueDate: client?.nextPaymentDue || '2026-10-05',
      paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
      status,
    };

    setPayments(prev => {
      const idx = prev.findIndex(p => p.clientId === clientId && p.month === month);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = paymentRecord;
        return copy;
      }
      return [paymentRecord, ...prev];
    });

    if (db) {
      setDoc(doc(db, "payments", payId), paymentRecord, { merge: true }).catch(() => {});
    }
  };

  const offboardClient = (clientId: string) => {
    const target = clients.find(c => c.id === clientId);
    const updatedNotes = (target?.notes || '') + ' [One-Time Handover Completed]';

    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            status: 'offboarded',
            billingType: 'one_time_build',
            notes: updatedNotes,
          };
        }
        return c;
      })
    );

    if (db) {
      setDoc(doc(db, "clients", clientId), {
        status: 'offboarded',
        billingType: 'one_time_build',
        notes: updatedNotes,
      }, { merge: true }).catch(() => {});
    }
  };

  const reactivateClient = (clientId: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            status: 'paid',
            billingType: 'monthly_retainer',
          };
        }
        return c;
      })
    );

    if (db) {
      setDoc(doc(db, "clients", clientId), {
        status: 'paid',
        billingType: 'monthly_retainer',
      }, { merge: true }).catch(() => {});
    }
  };

  const addTicket = (ticketData: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    setTickets(prev => prev.map(t => (t.id === ticketId ? { ...t, status } : t)));
  };

  const generateInvoice = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: client.nextPaymentDue || new Date().toISOString().split('T')[0],
      amount: client.monthlyFee || 4000,
      currency: client.currency,
      status: client.status === 'paid' ? 'paid' : client.status === 'overdue' ? 'overdue' : 'unpaid',
      items: [
        {
          description: `Monthly Retainer: Full Support, Security Monitoring & Daily Backups (${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})`,
          amount: client.monthlyFee || 4000,
        },
      ],
    };

    setInvoices(prev => [newInvoice, ...prev]);
  };

  useEffect(() => {
    localStorage.setItem('opendev_project_requests_v1', JSON.stringify(projectRequests));
  }, [projectRequests]);

  useEffect(() => {
    localStorage.setItem('opendev_changelogs_v1', JSON.stringify(changelogs));
  }, [changelogs]);

  const addProjectRequest = (reqData: Omit<ProjectRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ProjectRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending_review',
    };
    setProjectRequests(prev => [newReq, ...prev.filter(r => r.userEmail.toLowerCase() !== reqData.userEmail.toLowerCase())]);
  };

  const updateProjectRequestStatus = (id: string, status: ProjectRequest['status']) => {
    setProjectRequests(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
  };

  const approveProjectRequest = (id: string, code: string, domain: string, password?: string) => {
    const req = projectRequests.find(r => r.id === id);
    const cleanCode = code.trim().toUpperCase();
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const cleanPass = (password || 'client123').trim();

    setProjectRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status: 'accepted',
            assignedCode: cleanCode,
            assignedDomain: cleanDomain,
            assignedPassword: cleanPass,
          };
        }
        return r;
      })
    );

    const existingClient = clients.find(c =>
      (req && c.email.toLowerCase() === req.userEmail.toLowerCase()) ||
      (c.domain && c.domain.toLowerCase() === cleanDomain)
    );

    if (existingClient) {
      updateClient({
        ...existingClient,
        clientCode: cleanCode,
        domain: cleanDomain,
        password: cleanPass,
        websiteUrl: `https://${cleanDomain}`,
        websiteStatus: 'completed',
      });
    } else {
      addClient({
        name: req?.userName || 'Client Partner',
        company: req?.userName ? `${req.userName}'s Company` : 'Client Organization',
        email: req?.userEmail || 'client@opendev-labs.com',
        phone: '+91 81695 68582',
        websiteUrl: `https://${cleanDomain}`,
        domain: cleanDomain,
        websiteStatus: 'completed',
        advancePaid: true,
        advanceAmount: 5000,
        previewUrl: `https://${cleanDomain}`,
        billingType: 'monthly_retainer',
        monthlyFee: 4000,
        currency: 'INR',
        billingCycleDay: 5,
        nextPaymentDue: '2026-10-05',
        status: 'paid',
        razorpayPaymentLink: `https://rzp.io/l/opendev-${(req?.userName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        notes: `Approved client request for domain ${cleanDomain}. Assigned Code: ${cleanCode}`,
        clientCode: cleanCode,
        password: cleanPass,
      });
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Client Request Approved: ${req?.userName || 'Client'}`,
      message: `Assigned Code: ${cleanCode} | Domain: ${cleanDomain} | Password: ${cleanPass}`,
      date: new Date().toISOString().split('T')[0],
      type: 'system',
      read: false,
      clientName: req?.userName,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const rejectProjectRequest = (id: string) => {
    setProjectRequests(prev => prev.map(r => (r.id === id ? { ...r, status: 'rejected' } : r)));
  };

  const deleteProjectRequest = (id: string) => {
    setProjectRequests(prev => prev.filter(r => r.id !== id));
  };

  const generateClientCredentials = (data: {
    name: string;
    email: string;
    domain: string;
    clientCode: string;
    password?: string;
    monthlyFee?: number;
    company?: string;
    workStatus?: 'waiting_for_approval' | 'work_started' | 'in_progress' | 'testing_preview' | 'completed';
    progressPercentage?: number;
    advancePaid?: boolean;
    advanceAmount?: number;
    totalBill?: number;
    livePreviewUrl?: string;
    devPreviewUrl?: string;
    maintenanceStatus?: 'paid' | 'need_to_pay' | 'no_retainer';
    domainStatus?: 'active' | 'pending_dns' | 'expired' | 'registered';
  }) => {
    const cleanCode = data.clientCode.trim().toUpperCase();
    const cleanDomain = data.domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const cleanPass = (data.password || 'client123').trim();

    const existingClient = clients.find(c =>
      c.email.toLowerCase() === data.email.toLowerCase() ||
      (c.domain && c.domain.toLowerCase() === cleanDomain)
    );

    const workStat = data.workStatus || 'work_started';
    const progressPerc = data.progressPercentage !== undefined ? data.progressPercentage : (workStat === 'completed' ? 100 : workStat === 'testing_preview' ? 85 : workStat === 'work_started' ? 50 : 25);
    const liveUrl = data.livePreviewUrl || `https://${cleanDomain}`;
    const devUrl = data.devPreviewUrl || `https://${cleanDomain.split('.')[0]}-dev.vercel.app`;

    if (existingClient) {
      updateClient({
        ...existingClient,
        name: data.name || existingClient.name,
        company: data.company || existingClient.company,
        clientCode: cleanCode,
        domain: cleanDomain,
        password: cleanPass,
        websiteUrl: liveUrl,
        monthlyFee: data.monthlyFee || existingClient.monthlyFee || 4000,
        workStatus: workStat,
        progressPercentage: progressPerc,
        advancePaid: data.advancePaid !== undefined ? data.advancePaid : true,
        advanceAmount: data.advanceAmount !== undefined ? data.advanceAmount : 25000,
        totalBill: data.totalBill !== undefined ? data.totalBill : 70000,
        livePreviewUrl: liveUrl,
        devPreviewUrl: devUrl,
        maintenanceStatus: data.maintenanceStatus || 'paid',
        domainStatus: data.domainStatus || 'active',
      });
    } else {
      addClient({
        name: data.name,
        company: data.company || `${data.name}'s Company`,
        email: data.email,
        phone: '+91 81695 68582',
        websiteUrl: liveUrl,
        domain: cleanDomain,
        websiteStatus: workStat === 'completed' ? 'completed' : 'under-development',
        workStatus: workStat,
        progressPercentage: progressPerc,
        advancePaid: data.advancePaid !== undefined ? data.advancePaid : true,
        advanceAmount: data.advanceAmount !== undefined ? data.advanceAmount : 25000,
        totalBill: data.totalBill !== undefined ? data.totalBill : 70000,
        livePreviewUrl: liveUrl,
        devPreviewUrl: devUrl,
        maintenanceStatus: data.maintenanceStatus || 'paid',
        domainStatus: data.domainStatus || 'active',
        previewUrl: liveUrl,
        billingType: 'monthly_retainer',
        monthlyFee: data.monthlyFee || 4000,
        currency: 'INR',
        billingCycleDay: 5,
        nextPaymentDue: '2026-10-05',
        status: 'paid',
        razorpayPaymentLink: `https://rzp.io/l/opendev-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        notes: `Generated access code ${cleanCode} for ${cleanDomain}`,
        clientCode: cleanCode,
        password: cleanPass,
      });
    }
  };

  const addChangelog = (itemData: Omit<ChangelogItem, 'id' | 'date'>) => {
    const newLog: ChangelogItem = {
      ...itemData,
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setChangelogs(prev => [newLog, ...prev]);
  };

  const deleteChangelog = (id: string) => {
    setChangelogs(prev => prev.filter(l => l.id !== id));
  };

  const notifyPayment = (data: Omit<PaymentNotification, 'id' | 'date' | 'status'>) => {
    const newPaymentNotif: PaymentNotification = {
      ...data,
      id: `pnotif-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending_verification',
    };
    setPaymentNotifications(prev => [newPaymentNotif, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Payment Received (${data.paymentMethod}): ${data.clientName}`,
      message: `${data.clientName} reported payment of ₹${data.amount} via ${data.paymentMethod}. Ref: ${data.transactionRef || 'N/A'}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'payment',
      read: false,
      clientName: data.clientName,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const confirmPaymentNotification = (id: string) => {
    const notif = paymentNotifications.find(n => n.id === id);
    if (notif) {
      setPaymentNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, status: 'confirmed' as const } : n))
      );
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      markPaymentStatus(notif.clientId, currentMonth, 'paid');
    }
  };

  const rejectPaymentNotification = (id: string) => {
    setPaymentNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: 'rejected' as const } : n))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const sendNotification = (payload: {
    title: string;
    message: string;
    type?: 'reminder' | 'payment' | 'ticket' | 'system' | 'request' | 'security';
    targetType?: 'all' | 'client' | 'user';
    targetId?: string;
    targetName?: string;
  }) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'system',
      date: new Date().toISOString().split('T')[0],
      read: false,
      targetType: payload.targetType || 'all',
      targetEmail: payload.targetType === 'user' ? payload.targetId : undefined,
      clientId: payload.targetType === 'client' ? payload.targetId : undefined,
      clientName: payload.targetName,
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (db) {
      try {
        setDoc(doc(db, "notifications", newNotif.id), newNotif, { merge: true });
      } catch (e) {
        console.warn("sendNotification Firestore error:", e);
      }
    }
  };

  const getWhatsAppReminderUrl = (client: Client) => {
    const message = `Hello ${client.name} 👋, this is Yash Shirish Ramteke from OpenDev-Labs (www.opendev-labs.com).\n\nA friendly reminder for your monthly webapp retainer of ${client.currency === 'INR' ? '₹' : '$'}${client.monthlyFee.toLocaleString()} due on ${client.nextPaymentDue}.\n\nPay online via Razorpay: ${client.razorpayPaymentLink || 'https://opendev-labs.com/client/portal'}\n\nWork Mail: opendev.office@gmail.com | Phone: +91 81695 68582`;
    const cleanPhone = client.phone.replace(/[^0-9]/g, '') || '918169568582';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const getRazorpayLink = (client: Client) => {
    return client.razorpayPaymentLink || `https://rzp.io/l/opendev-${client.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        payments,
        invoices,
        tickets,
        notifications,
        projectRequests,
        changelogs,
        paymentNotifications,
        customAgents,
        addClient,
        updateClient,
        deleteClient,
        clearAllClients,
        markPaymentStatus,
        offboardClient,
        reactivateClient,
        addTicket,
        updateTicketStatus,
        generateInvoice,
        markNotificationRead,
        sendNotification,
        getWhatsAppReminderUrl,
        getRazorpayLink,
        addProjectRequest,
        updateProjectRequestStatus,
        approveProjectRequest,
        rejectProjectRequest,
        deleteProjectRequest,
        generateClientCredentials,
        addChangelog,
        deleteChangelog,
        notifyPayment,
        confirmPaymentNotification,
        rejectPaymentNotification,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};
