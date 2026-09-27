import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClientProvider } from './context/ClientContext';
import { ThemeProvider } from './context/ThemeContext';
import { AISupportProvider } from './context/AISupportContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PricingStandalonePage } from './pages/PricingStandalonePage';
import { SolutionsPage } from './pages/SolutionsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { ClientsManager } from './pages/ClientsManager';
import { PaymentReminders } from './pages/PaymentReminders';
import { InvoicesPage } from './pages/InvoicesPage';
import { ClientPortal } from './pages/ClientPortal';
import { ClientPaymentsPage } from './pages/ClientPaymentsPage';
import { ClientSupportPage } from './pages/ClientSupportPage';
import { ClientMilestonesPage } from './pages/ClientMilestonesPage';
import { ClientCredentialsPage } from './pages/ClientCredentialsPage';
import { ProfileSettings } from './pages/ProfileSettings';
import { OpenStudioPage } from './pages/OpenStudioPage';
import OpenStudioLandingPage from './pages/OpenStudioLandingPage';
import { OpenStudioPricingPage } from './pages/OpenStudioPricingPage';
import { AIPage } from './pages/AIPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ClientConversionPage } from './pages/ClientConversionPage';
import { UserSecurityPage } from './pages/UserSecurityPage';
import { ClientRequestsPage } from './pages/ClientRequestsPage';
import { NotificationHistoryPage } from './pages/NotificationHistoryPage';
import { AdminGatePage } from './pages/AdminGatePage';
import { AdminControlCenter } from './pages/AdminControlCenter';

import { ProtectedRoute } from './components/ProtectedRoute';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';

// Wrapper helper to pass outlet context props to page components
const DevDashboardWrapper: React.FC = () => {
  const context = useOutletContext<{ onOpenAddClient: () => void }>();
  return <DeveloperDashboard onOpenAddClient={context?.onOpenAddClient || (() => {})} />;
};

const ClientsManagerWrapper: React.FC = () => {
  const context = useOutletContext<{ onOpenAddClient: () => void }>();
  return <ClientsManager onOpenAddClient={context?.onOpenAddClient || (() => {})} />;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClientProvider>
          <BrowserRouter>
            <AISupportProvider>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/ai" element={<AIPage />} />
                <Route path="/open-studio" element={<OpenStudioPage />} />
                <Route path="/openstudio" element={<OpenStudioLandingPage />} />
                <Route path="/openstudio/pricing" element={<OpenStudioPricingPage />} />
                <Route path="/open-studio/pricing" element={<Navigate to="/openstudio/pricing" replace />} />
                <Route path="/studio" element={<OpenStudioPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/pricing" element={<PricingStandalonePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/notifications" element={<Navigate to="/client/notifications" replace />} />

                {/* 🛡️ CENTRAL ADMIN CONTROL CENTER & CRM — Full OpenDev-Labs & Subdomain Control */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminControlCenter />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedAdminRoute>
                      <AdminControlCenter />
                    </ProtectedAdminRoute>
                  }
                />
                <Route path="/admin-panel" element={<Navigate to="/admin" replace />} />
                <Route path="/admin-control" element={<Navigate to="/admin" replace />} />

                {/* 🔐 SECRET ADMIN GATE */}
                <Route path="/xk9-admin-gate" element={<AdminGatePage />} />
                <Route
                  path="/xk9-admin-control"
                  element={
                    <ProtectedAdminRoute>
                      <AdminControlCenter />
                    </ProtectedAdminRoute>
                  }
                />
                <Route path="/xk9-admin-control/*" element={
                    <ProtectedAdminRoute>
                      <AdminControlCenter />
                    </ProtectedAdminRoute>
                  }
                />

                {/* Developer Admin Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['developer']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DevDashboardWrapper />} />
                  <Route path="clients" element={<ClientsManagerWrapper />} />
                  <Route path="requests" element={<ClientRequestsPage />} />
                  <Route path="reminders" element={<PaymentReminders />} />
                  <Route path="invoices" element={<InvoicesPage />} />
                  <Route path="notifications" element={<NotificationHistoryPage />} />
                  <Route path="settings" element={<ProfileSettings />} />
                </Route>

                {/* Client Portal View */}
                <Route
                  path="/client"
                  element={
                    <ProtectedRoute allowedRoles={['client', 'developer', 'user']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/client/portal" replace />} />
                  <Route path="portal" element={<ClientPortal />} />
                  <Route path="payments" element={<ClientPaymentsPage />} />
                  <Route path="invoices" element={<InvoicesPage />} />
                  <Route path="support" element={<ClientSupportPage />} />
                  <Route path="milestones" element={<ClientMilestonesPage />} />
                  <Route path="credentials" element={<ClientCredentialsPage />} />
                  <Route path="profile" element={<UserProfilePage />} />
                  <Route path="convert" element={<ClientConversionPage />} />
                  <Route path="security" element={<UserSecurityPage />} />
                  <Route path="notifications" element={<NotificationHistoryPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AISupportProvider>
          </BrowserRouter>
        </ClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
