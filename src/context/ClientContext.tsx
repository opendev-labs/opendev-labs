import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, PaymentRecord, Invoice, MaintenanceTicket, NotificationItem } from '../types';

interface ClientContextType {
  clients: Client[];
  payments: PaymentRecord[];
  invoices: Invoice[];
  tickets: MaintenanceTicket[];
  notifications: NotificationItem[];
  addClient: (client: Omit<Client, 'id' | 'joinedDate'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  markPaymentStatus: (clientId: string, month: string, status: 'paid' | 'pending' | 'overdue') => void;
  offboardClient: (clientId: string) => void;
  reactivateClient: (clientId: string) => void;
  addTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>) => void;
  updateTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => void;
  generateInvoice: (clientId: string) => void;
  markNotificationRead: (id: string) => void;
  getWhatsAppReminderUrl: (client: Client) => string;
  getRazorpayLink: (client: Client) => string;
}

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-elite',
    name: 'Elite-Trading Hub',
    company: 'Momhand Khawar (Elite-Trading)',
    email: 'khawar@elitetradinghub.com',
    phone: '+91 81695 68582',
    websiteUrl: 'https://elite-tradinghub.com',
    previewUrl: 'https://elite-tradinghub.com',
    billingType: 'monthly_retainer',
    monthlyFee: 4000,
    currency: 'INR',
    billingCycleDay: 5,
    nextPaymentDue: '2026-09-05',
    status: 'paid',
    joinedDate: '2026-08-27',
    password: 'elitetrading123',
    razorpayPaymentLink: 'https://rzp.io/l/opendev-elitetrading',
    notes: 'Financial WebApp Project (₹6,000 Advance Paid to start work; remaining paid upon delivery). Active ₹4,000/mo retainer for daily backups & SEBI compliance.'
  },
  {
    id: 'client-vishwa',
    name: 'Vishwa Leader Institute',
    company: 'Vishwa Leader Edu Foundation',
    email: 'contact@vishwaleader.com',
    phone: '+91 81695 68582',
    websiteUrl: 'https://vishwaleader.com',
    previewUrl: 'https://vishwaleader.com',
    billingType: 'monthly_retainer',
    monthlyFee: 6000,
    currency: 'INR',
    billingCycleDay: 10,
    nextPaymentDue: '2026-09-10',
    status: 'paid',
    joinedDate: '2026-01-20',
    password: 'vishwaleader123',
    razorpayPaymentLink: 'https://rzp.io/l/opendev-vishwaleader',
    notes: 'High-Value Enterprise Educational Platform (₹2,50,000 One-Time Build) + Active ₹6,000/mo Maintenance & Server Cloud Retainer.'
  },
  {
    id: 'client-techmatrix',
    name: 'TechMatrix Global',
    company: 'TechMatrix Ltd.',
    email: 'opendev.office@gmail.com',
    phone: '+91 81695 68582',
    websiteUrl: 'https://techmatrixglobal.com',
    previewUrl: 'https://techmatrixglobal.com',
    billingType: 'monthly_retainer',
    monthlyFee: 15000,
    currency: 'INR',
    billingCycleDay: 1,
    nextPaymentDue: '2026-09-01',
    status: 'overdue',
    joinedDate: '2025-11-10',
    password: 'techmatrix123',
    razorpayPaymentLink: 'https://rzp.io/l/opendev-techmatrix',
    notes: 'AI-Powered Enterprise System (₹15,000/mo Retainer). Hosted on Vercel & Render cloud servers with daily DB backups.'
  }
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-elite-101',
    clientId: 'client-elite',
    clientName: 'Elite-Trading Hub',
    month: 'September 2026',
    amount: 4000,
    dueDate: '2026-09-05',
    paidDate: '2026-09-02',
    status: 'paid',
    paymentMethod: 'UPI / Razorpay',
    notes: 'Monthly retainer ₹4,000 active for full support & backups.'
  },
  {
    id: 'pay-tech-102',
    clientId: 'client-techmatrix',
    clientName: 'TechMatrix Global',
    month: 'September 2026',
    amount: 15000,
    dueDate: '2026-09-01',
    status: 'overdue',
    notes: 'Automated WhatsApp payment reminder sent.'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-087',
    invoiceNumber: 'INV-2026-087',
    clientId: 'client-elite',
    clientName: 'Elite-Trading Hub (Momhand Khawar)',
    clientEmail: 'opendev.office@gmail.com',
    issueDate: '2026-08-27',
    dueDate: '2026-09-05',
    amount: 4000,
    currency: 'INR',
    status: 'paid',
    items: [
      { description: 'Monthly WebApp Retainer: Full Support, Security Monitoring & Daily Backups', amount: 4000 }
    ]
  }
];

const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'tkt-elite-1',
    clientId: 'client-elite',
    clientName: 'Elite-Trading Hub',
    title: 'SEBI Compliance Disclaimer update on PMS footer',
    description: 'Update the regulatory governance text on the Risk/Reward calculator page.',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-09-01',
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Payment Received: Elite-Trading Hub',
    message: '₹4,000 monthly retainer collected for September 2026.',
    type: 'payment',
    date: '2026-09-02',
    read: true,
    clientId: 'client-elite',
  },
  {
    id: 'notif-2',
    title: 'Payment Overdue: TechMatrix Global',
    message: '₹15,000 retainer payment was due on Sept 1, 2026.',
    type: 'reminder',
    date: '2026-09-02',
    read: false,
    clientId: 'client-techmatrix',
  }
];

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('opendev_clients_v4');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('opendev_payments_v4');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('opendev_invoices_v4');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('opendev_tickets_v4');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('opendev_notifications_v4');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('opendev_clients_v4', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('opendev_payments_v4', JSON.stringify(payments));
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

  const addClient = (clientData: Omit<Client, 'id' | 'joinedDate'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      razorpayPaymentLink: `https://rzp.io/l/opendev-${clientData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => (c.id === updatedClient.id ? updatedClient : c)));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
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
        addClient,
        updateClient,
        deleteClient,
        markPaymentStatus,
        offboardClient,
        reactivateClient,
        addTicket,
        updateTicketStatus,
        generateInvoice,
        markNotificationRead,
        getWhatsAppReminderUrl,
        getRazorpayLink,
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
