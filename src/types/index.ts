export type UserRole = 'developer' | 'client' | 'user';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  role: UserRole;
  clientId?: string;
  online?: boolean;
  team?: string;
  authMethod?: 'google' | 'password' | 'github' | 'phone' | string;
  ipAddress?: string;
  location?: string;
  lastActive?: string;
  sessionDuration?: string;
}

export type BillingType = 'monthly_retainer' | 'one_time_build';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'offboarded';

export type WebsiteStatus = 'under-development' | 'under-maintenance' | 'completed';

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
  domain?: string;
  websiteStatus: WebsiteStatus;
  workStatus?: 'waiting_for_approval' | 'work_started' | 'in_progress' | 'testing_preview' | 'completed';
  progressPercentage?: number; // 0 to 100
  advancePaid: boolean;
  advanceAmount?: number;
  totalBill?: number;
  livePreviewUrl?: string; // e.g. https://elite-tradinghub.com
  devPreviewUrl?: string; // e.g. https://project.vercel.app
  previewUrl?: string;
  billingType: BillingType;
  monthlyFee: number; // in INR or USD
  currency: 'INR' | 'USD';
  billingCycleDay: number; // 1 to 31
  nextPaymentDue: string;
  status: PaymentStatus;
  maintenanceStatus?: 'paid' | 'need_to_pay' | 'no_retainer';
  domainStatus?: 'active' | 'pending_dns' | 'expired' | 'registered';
  joinedDate: string;
  razorpayPaymentLink?: string;
  notes?: string;
  password?: string;
  clientCode?: string;
  sudoPassword?: string;
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
  type: 'reminder' | 'payment' | 'ticket' | 'system' | 'request' | 'security';
  date: string;
  read: boolean;
  clientId?: string;
  clientName?: string;
  targetType?: 'all' | 'client' | 'user';
  targetEmail?: string;
}

export interface ProjectRequest {
  id: string;
  userEmail: string;
  userName: string;
  projectType: string;
  requestedDomain: string;
  extraRequirements: string;
  createdAt: string;
  status: 'pending_review' | 'accepted' | 'rejected' | 'client_converted';
  assignedCode?: string;
  assignedDomain?: string;
  assignedPassword?: string;
}

export interface ChangelogItem {
  id: string;
  clientId: string; // client ID or 'all'
  clientName: string;
  title: string;
  version?: string;
  description: string;
  date: string;
}

export interface PaymentNotification {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  paymentMethod: 'GPay' | 'PhonePe' | 'Cash' | 'Bank Transfer / NEFT' | 'Razorpay' | 'Kotak Direct UPI' | 'Other';
  transactionRef?: string;
  notes?: string;
  date: string;
  status: 'pending_verification' | 'confirmed' | 'rejected';
}

export interface CustomAgent {
  id: string;
  name: string;
  model: string;
  projectKey: string;
  targetDomain: string;
  status: 'active' | 'deploying' | 'idle' | 'error';
  requests24h: number;
  latencyMs: number;
  accuracyRate: string;
  description: string;
  lastTrained: string;
}

export interface LiveAnalyticsPoint {
  timestamp: string;
  requestsPerSec: number;
  activeSessions: number;
  cpuUsage: number;
  memUsage: number;
  latencyMs: number;
}

export interface ProjectTelemetry {
  id: string;
  title: string;
  domain: string;
  category: string;
  status: 'live' | 'scaling' | 'maintenance' | 'beta';
  uptime: string;
  mrr: string;
  activeUsersCount: number;
  reqPerMin: number;
  health: 'healthy' | 'warning' | 'degraded';
}

