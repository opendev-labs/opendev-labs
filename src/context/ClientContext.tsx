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
  getWhatsAppReminderUrl: (client: Client) => string;
  getRazorpayLink: (client: Client) => string;
  addProjectRequest: (req: Omit<ProjectRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateProjectRequestStatus: (id: string, status: ProjectRequest['status']) => void;
  addChangelog: (item: Omit<ChangelogItem, 'id' | 'date'>) => void;
  deleteChangelog: (id: string) => void;
  notifyPayment: (data: Omit<PaymentNotification, 'id' | 'date' | 'status'>) => void;
  confirmPaymentNotification: (id: string) => void;
  rejectPaymentNotification: (id: string) => void;
}

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Elite Trading Hub',
    company: 'Elite Trading Systems Ltd',
    email: 'rahul.sharma@elite-trading.com',
    phone: '+91 98765 43210',
    websiteUrl: 'https://elite-tradinghub.com',
    domain: 'elite-tradinghub.com',
    websiteStatus: 'completed',
    advancePaid: true,
    advanceAmount: 25000,
    previewUrl: 'https://elite-tradinghub.com',
    billingType: 'monthly_retainer',
    monthlyFee: 45000,
    currency: 'INR',
    billingCycleDay: 5,
    nextPaymentDue: '2026-10-05',
    status: 'paid',
    joinedDate: '2026-08-10',
    razorpayPaymentLink: 'https://rzp.io/l/elitetradinghub',
    notes: 'High-frequency algorithmic trading web application with real-time WebSocket charts.',
    clientCode: 'ELITE2026',
    password: 'client123',
  },
  {
    id: 'client-2',
    name: 'Vishwa Leader Corp',
    company: 'Vishwa Leader Global Enterprises',
    email: 'priya.patel@techfirm.io',
    phone: '+91 98123 45678',
    websiteUrl: 'https://vishwaleadr.com',
    domain: 'vishwaleadr.com',
    websiteStatus: 'completed',
    advancePaid: true,
    advanceAmount: 35000,
    previewUrl: 'https://vishwaleadr.com',
    billingType: 'monthly_retainer',
    monthlyFee: 65000,
    currency: 'INR',
    billingCycleDay: 10,
    nextPaymentDue: '2026-10-10',
    status: 'paid',
    joinedDate: '2026-08-15',
    razorpayPaymentLink: 'https://rzp.io/l/vishwaleadr',
    notes: 'Global leadership news, analytics & community portal built with Next.js & Firebase.',
    clientCode: 'VISHWA2026',
    password: 'client123',
  },
  {
    id: 'client-3',
    name: 'OpenDev-Labs Architecture',
    company: 'OpenDev-Labs Sovereign Agency',
    email: 'opendev.office@gmail.com',
    phone: '+91 91234 56789',
    websiteUrl: 'https://opendev-labs.com',
    domain: 'opendev-labs.com',
    websiteStatus: 'completed',
    advancePaid: true,
    advanceAmount: 50000,
    previewUrl: 'https://opendev-labs.com',
    billingType: 'monthly_retainer',
    monthlyFee: 120000,
    currency: 'INR',
    billingCycleDay: 1,
    nextPaymentDue: '2026-10-01',
    status: 'paid',
    joinedDate: '2026-08-01',
    razorpayPaymentLink: 'https://rzp.io/l/opendevlabs',
    notes: 'Primary agency infrastructure, Void IDE terminal, and custom AI agent execution suite.',
    clientCode: 'OPENDEV2026',
    password: 'client123',
  }
];

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
const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
const INITIAL_PROJECT_REQUESTS: ProjectRequest[] = [];
const INITIAL_CHANGELOGS: ChangelogItem[] = [];
const INITIAL_PAYMENT_NOTIFICATIONS: PaymentNotification[] = [];

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('opendev_clients_v6');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
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
    const saved = localStorage.getItem('opendev_notifications_v5');
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

  // 1. Real-time Firestore Clients Listener & Auto-Seeding
  useEffect(() => {
    if (!db) return;

    const unsubClients = onSnapshot(collection(db, "clients"), async (snapshot) => {
      if (snapshot.empty) {
        // Automatically seed INITIAL_CLIENTS into Firestore
        try {
          for (const c of INITIAL_CLIENTS) {
            await setDoc(doc(db, "clients", c.id), c);
          }
        } catch (seedErr) {
          console.warn("Error seeding clients into Firestore:", seedErr);
        }
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

    return () => {
      unsubClients();
      unsubPayments();
    };
  }, []);

  // Local Storage Backups
  useEffect(() => {
    localStorage.setItem('opendev_clients_v6', JSON.stringify(clients));
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
        getWhatsAppReminderUrl,
        getRazorpayLink,
        addProjectRequest,
        updateProjectRequestStatus,
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
