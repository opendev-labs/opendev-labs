import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clientId?: string;
  avatar?: string;
  authMethod?: 'google' | 'password';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginAsDeveloper: () => void;
  loginAsClient: (clientId: string) => void;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_USER: AuthUser = {
  id: 'dev-1',
  name: 'Yash Shirish Ramteke',
  email: 'opendev.office@gmail.com',
  role: 'developer',
  authMethod: 'password',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('opendev_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('opendev_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('opendev_auth_user');
    }
  }, [user]);

  const loginAsDeveloper = () => {
    setUser(DEV_USER);
  };

  const loginAsClient = (clientId: string) => {
    setUser({
      id: `user-${clientId}`,
      name: 'Client Partner',
      email: 'client@opendev-labs.com',
      role: 'client',
      clientId: clientId,
      authMethod: 'password',
    });
  };

  const loginWithGoogle = (
    googleEmail = 'khawar@elitetradinghub.com',
    googleName = 'Khawar (Elite-Trading)',
    googleAvatar = 'https://lh3.googleusercontent.com/a/default-user'
  ) => {
    // Map email to client or default to client-1
    const clientId = googleEmail.includes('vishwa') ? 'client-2' : 'client-1';
    setUser({
      id: `google-${Date.now()}`,
      name: googleName,
      email: googleEmail,
      role: 'client',
      clientId: clientId,
      authMethod: 'google',
      avatar: googleAvatar || 'https://lh3.googleusercontent.com/a/default-user',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsDeveloper,
        loginAsClient,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

