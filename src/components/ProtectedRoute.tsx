import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlobalLoader } from '../features/void/components/common/GlobalLoader';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('developer' | 'client' | 'user')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated || !user) {
        // Redirect to /auth but save the current location they were trying to go to
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Role-Based Isolation Check
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === 'client' || user.role === 'user') {
            return <Navigate to="/client/portal" replace />;
        }
        if (user.role === 'developer') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
};
