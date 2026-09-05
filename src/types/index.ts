export type UserRole = 'developer' | 'client';

export type BillingType = 'monthly_retainer' | 'one_time_build';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'offboarded';

export interface PaymentRecord {
  id: string;
  clientId: string;
  clientName: string;
  month: string; // e.g. "September 2026"
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  razorpayLinkId?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  websiteUrl: string;
  previewUrl?: string;
  billingType: BillingType;
  monthlyFee: number; // in INR or USD
  currency: 'INR' | 'USD';
  billingCycleDay: number; // 1 to 31
  nextPaymentDue: string;
  status: PaymentStatus;
  joinedDate: string;
  razorpayPaymentLink?: string;
  notes?: string;
  password?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue';
  items: {
    description: string;
    amount: number;
  }[];
}

export interface MaintenanceTicket {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'payment' | 'ticket' | 'system';
  date: string;
  read: boolean;
  clientId?: string;
}
