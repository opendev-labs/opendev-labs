import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../lib/adminAuth';
import { useAuth, isDeveloperEmail } from '../context/AuthContext';

/**
 * Protects admin-only routes.
 * Accessible by:
 * 1. Logged-in developers/admins from AuthContext
 * 2. Anyone who authenticated through the Secret Admin Gate (/xk9-admin-gate)
 */
export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const hasGateAuth = isAdminAuthenticated();
  const isDevUser = isAuthenticated && (user?.role === 'developer' || isDeveloperEmail(user?.email));

  if (!hasGateAuth && !isDevUser) {
    if (!isAuthenticated) {
      return <Navigate to="/auth?redirect=/admin" replace />;
    }
    return <Navigate to="/xk9-admin-gate" replace />;
  }

  return <>{children}</>;
};
