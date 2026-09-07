import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, PaymentRecord, Invoice, MaintenanceTicket, NotificationItem, ProjectRequest, ChangelogItem, PaymentNotification } from '../types';

interface ClientContextType {
  clients: Client[];
  payments: PaymentRecord[];
  invoices: Invoice[];
  tickets: MaintenanceTicket[];
  notifications: NotificationItem[];
  projectRequests: ProjectRequest[];
  changelogs: ChangelogItem[];
  paymentNotifications: PaymentNotification[];
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

const INITIAL_CLIENTS: Client[] = [];
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
    const saved = localStorage.getItem('opendev_clients_v5');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

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

  useEffect(() => {
    localStorage.setItem('opendev_clients_v5', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('opendev_payments_v5', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('opendev_invoices_v4', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('opendev_tickets_v4', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('opendev_notifications_v4', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('opendev_payment_notifications_v1', JSON.stringify(paymentNotifications));
  }, [paymentNotifications]);

  const addClient = (clientData: Omit<Client, 'id' | 'joinedDate'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      razorpayPaymentLink: clientData.razorpayPaymentLink || `https://rzp.io/l/opendev-${clientData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => (c.id === updatedClient.id ? updatedClient : c)));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const clearAllClients = () => {
    setClients([]);
  };

  const markPaymentStatus = (clientId: string, month: string, status: 'paid' | 'pending' | 'overdue') => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            status: status === 'paid' ? 'paid' : status === 'overdue' ? 'overdue' : 'pending',
          };
        }
        return c;
      })
    );

    setPayments(prev => {
      const existingIndex = prev.findIndex(p => p.clientId === clientId && p.month === month);
      const client = clients.find(c => c.id === clientId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status,
          paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
        };
        return updated;
      } else if (client) {
        return [
          ...prev,
          {
            id: `pay-${Date.now()}`,
            clientId,
            clientName: client.name,
            month,
            amount: client.monthlyFee,
            dueDate: client.nextPaymentDue,
            paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
            status,
          },
        ];
      }
      return prev;
    });
  };

  const offboardClient = (clientId: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            status: 'offboarded',
            billingType: 'one_time_build',
            notes: (c.notes || '') + ' [One-Time Handover Completed]',
          };
        }
        return c;
      })
    );
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
