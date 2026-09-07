import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, RegisteredUser } from '../types';

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
  registeredUsers: RegisteredUser[];
  loginAsDeveloper: () => void;
  loginAsClient: (clientId: string) => void;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => void;
  convertRegisteredUserToClient: (userId: string, clientId: string, clientName?: string) => void;
  deleteRegisteredUser: (userId: string) => void;
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

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('opendev_registered_users_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse registered users', e);
      }
    }
    return [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('opendev_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('opendev_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('opendev_registered_users_v2', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

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
    googleEmail = 'user@gmail.com',
    googleName = 'Google User',
    googleAvatar = 'https://lh3.googleusercontent.com/a/default-user'
  ) => {
    const cleanEmail = googleEmail.toLowerCase().trim();
    
    // Check if user is already registered or converted to client
    const existingRegistered = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    
    // Check if client exists in localStorage opendev_clients_v4
    let existingClientId: string | undefined = existingRegistered?.clientId;
    let userRole: UserRole = existingRegistered?.role || 'user';

    if (!existingClientId) {
      try {
        const savedClientsStr = localStorage.getItem('opendev_clients_v4');
        if (savedClientsStr) {
          const savedClients = JSON.parse(savedClientsStr);
          const foundClient = savedClients.find((c: any) => c.email.toLowerCase() === cleanEmail);
          if (foundClient) {
            existingClientId = foundClient.id;
            userRole = 'client';
          }
        }
      } catch (e) {
        console.error('Error checking saved clients', e);
      }
    }

    const nameToUse = googleName || (googleEmail.includes('@') ? googleEmail.split('@')[0] : 'Google User');
    const userId = existingRegistered?.id || `user-g-${Date.now()}`;

    const updatedUserRecord: RegisteredUser = {
      id: userId,
      name: nameToUse,
      email: googleEmail,
      avatar: googleAvatar || 'https://lh3.googleusercontent.com/a/default-user',
      joinedAt: existingRegistered?.joinedAt || new Date().toISOString().split('T')[0],
      role: userRole,
      clientId: existingClientId,
    };

    // Update registeredUsers list
    setRegisteredUsers(prev => {
      const idx = prev.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updatedUserRecord };
        return copy;
      }
      return [updatedUserRecord, ...prev];
    });

    setUser({
      id: userId,
      name: nameToUse,
      email: googleEmail,
      role: userRole,
      clientId: existingClientId,
      authMethod: 'google',
      avatar: googleAvatar || 'https://lh3.googleusercontent.com/a/default-user',
    });
  };

  const convertRegisteredUserToClient = (userId: string, clientId: string, clientName?: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => {
        if (u.id === userId || u.email === userId) {
          return {
            ...u,
            role: 'client',
            clientId,
            name: clientName || u.name,
          };
        }
        return u;
      })
    );

    // If current logged-in user matches target user, update their active user session
    setUser(prev => {
      if (prev && (prev.id === userId || prev.email === userId)) {
        return {
          ...prev,
          role: 'client',
          clientId,
          name: clientName || prev.name,
        };
      }
      return prev;
    });
  };

  const deleteRegisteredUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId && u.email !== userId));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        registeredUsers,
        loginAsDeveloper,
        loginAsClient,
        loginWithGoogle,
        convertRegisteredUserToClient,
        deleteRegisteredUser,
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


