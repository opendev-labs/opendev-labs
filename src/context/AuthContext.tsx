import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, RegisteredUser } from '../types';
import { auth, db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
  loginAsClient: (clientId: string, clientName?: string, clientEmail?: string) => void;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => void;
  convertRegisteredUserToClient: (userId: string, clientId: string, clientName?: string) => void;
  deleteRegisteredUser: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_USER: AuthUser = {
  id: 'dev-1',
  name: 'Yash Shirish Ramteke',
  email: 'opendev-labs.office@gmail.com',
  role: 'developer',
  authMethod: 'password',
};

const DEFAULT_REGISTERED_USERS: RegisteredUser[] = [
  {
    id: 'Jz5KKaIBATRRpIv7f8RF7LpzTaf1',
    name: 'Yash Shirish Ramteke',
    email: 'iamyash.creator@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinedAt: '2026-01-31',
    role: 'developer',
    online: true,
    team: 'OpenDev Studio Executive',
    authMethod: 'google',
    ipAddress: '103.15.244.12',
    location: 'Mumbai, IN',
    lastActive: 'Just now',
    sessionDuration: '5h 15m',
  },
  {
    id: '6IcFDp87QdeAv52BKmC17CmVocJ2',
    name: 'Yash Ramteke',
    email: 'yashramteke55555@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    joinedAt: '2026-01-30',
    role: 'developer',
    online: true,
    team: 'Core Architecture',
    authMethod: 'google',
    ipAddress: '103.15.244.18',
    location: 'Mumbai, IN',
    lastActive: 'Just now',
    sessionDuration: '3h 40m',
  },
  {
    id: 'cDQhIsg44ofPNrvdqtK1ErD7wFu1',
    name: 'OpenDev Help Desk',
    email: 'opendev.help@gmail.com',
    joinedAt: '2026-01-30',
    role: 'developer',
    online: true,
    team: 'DevOps & Infrastructure',
    authMethod: 'google',
    ipAddress: '103.15.244.20',
    location: 'Bengaluru, IN',
    lastActive: '5m ago',
    sessionDuration: '2h 10m',
  },
  {
    id: 'M34KiydplKR6g8yZR63z6M1fyX22',
    name: 'OpenDev Support Desk',
    email: 'opendev.support@gmail.com',
    joinedAt: '2026-07-15',
    role: 'developer',
    online: true,
    team: 'Client Support Engineering',
    authMethod: 'google',
    ipAddress: '103.15.244.22',
    location: 'Pune, IN',
    lastActive: '12m ago',
    sessionDuration: '1h 55m',
  },
  {
    id: 'ts8QjX9MDfWXaBLKRVNApvr5AnO2',
    name: 'Afwan Khan',
    email: 'afwank768@gmail.com',
    joinedAt: '2026-09-07',
    role: 'user',
    online: true,
    team: 'Google Auth Member',
    authMethod: 'google',
    ipAddress: '49.36.192.12',
    location: 'Delhi, IN',
    lastActive: 'Just now',
    sessionDuration: '48m',
  },
  {
    id: 'tkpa0F221hasliTsvyr3LxHenO93',
    name: 'VTXCY Member',
    email: 'vtxcy22@gmail.com',
    joinedAt: '2026-09-06',
    role: 'user',
    online: true,
    team: 'Google Auth Member',
    authMethod: 'google',
    ipAddress: '157.34.88.42',
    location: 'Bengaluru, IN',
    lastActive: '1m ago',
    sessionDuration: '32m',
  },
  {
    id: 'i4xWeKpUTufUkIFGZZyUUwnkpCu1',
    name: 'Faizan HD',
    email: 'faizanhd5@gmail.com',
    joinedAt: '2026-09-06',
    role: 'user',
    online: false,
    team: 'Google Auth Member',
    authMethod: 'google',
    ipAddress: '182.73.44.15',
    location: 'Hyderabad, IN',
    lastActive: '1d ago',
    sessionDuration: '18m',
  },
  {
    id: 'fJ5V5batwxg9sjRk5Ut61mA47Hm2',
    name: 'Subatomic Error Member',
    email: 'subatomicerror@gmail.com',
    joinedAt: '2026-07-07',
    role: 'user',
    online: false,
    team: 'Experimental Tester',
    authMethod: 'google',
    ipAddress: '115.240.90.8',
    location: 'Ahmedabad, IN',
    lastActive: '2d ago',
    sessionDuration: '24m',
  },
  {
    id: 'm1mlItegiIfhppiLuejxDwGGT8n2',
    name: 'Franklin VLF',
    email: 'franklinvlf5@gmail.com',
    joinedAt: '2026-06-06',
    role: 'user',
    online: false,
    team: 'Community Member',
    authMethod: 'google',
    ipAddress: '122.169.34.90',
    location: 'Chennai, IN',
    lastActive: '3d ago',
    sessionDuration: '15m',
  },
  {
    id: 'FxvRcN12LDU6mdOVF3X5D8rLT4A2',
    name: 'Preet Jagtap',
    email: 'jagtappreet73@gmail.com',
    joinedAt: '2026-05-06',
    role: 'user',
    online: false,
    team: 'Vishwa Leader Community',
    authMethod: 'google',
    ipAddress: '106.210.88.94',
    location: 'Pune, IN',
    lastActive: '4d ago',
    sessionDuration: '20m',
  },
  {
    id: 'v6vf99ZDUpeUSPlcpEACXMfBQTS2',
    name: 'Prabhakar Khatri',
    email: 'prabhakarkhatri395@gmail.com',
    joinedAt: '2026-05-02',
    role: 'user',
    online: false,
    team: 'Community Member',
    authMethod: 'google',
    ipAddress: '223.185.10.88',
    location: 'Jaipur, IN',
    lastActive: '5d ago',
    sessionDuration: '10m',
  },
  {
    id: 'G6PkVhsZhnV3H5J2BjtksxmAgqO2',
    name: 'Manuel Varillas',
    email: 'manuel.varillas21@gmail.com',
    joinedAt: '2026-04-17',
    role: 'user',
    online: false,
    team: 'Global Community Member',
    authMethod: 'google',
    ipAddress: '190.237.112.5',
    location: 'Lima, PE',
    lastActive: '1w ago',
    sessionDuration: '14m',
  },
  {
    id: 'EefwgZMoqRfGZnMBkkxFyocp0q62',
    name: 'Nirbhay Ramteke',
    email: 'nirbhay.ramteke1234@gmail.com',
    joinedAt: '2026-04-14',
    role: 'user',
    online: false,
    team: 'Studio Network',
    authMethod: 'google',
    ipAddress: '103.15.244.30',
    location: 'Nagpur, IN',
    lastActive: '2w ago',
    sessionDuration: '35m',
  },
  {
    id: 'YgoEZUL9ZkdmMT49uISXr32YQup2',
    name: 'Karanjeet Singh',
    email: 'karanjeetsingh314@gmail.com',
    joinedAt: '2026-02-05',
    role: 'user',
    online: false,
    team: 'Retail Trader Network',
    authMethod: 'google',
    ipAddress: '106.210.88.102',
    location: 'Chandigarh, IN',
    lastActive: '2w ago',
    sessionDuration: '40m',
  },
  {
    id: 'I0SXAnOwrJgSugqazdLkpEJzBkp2',
    name: 'Bidiwale Chicha',
    email: 'bidiwalechicha@gmail.com',
    joinedAt: '2026-02-01',
    role: 'user',
    online: false,
    team: 'Community Member',
    authMethod: 'google',
    ipAddress: '103.15.244.45',
    location: 'Nagpur, IN',
    lastActive: '3w ago',
    sessionDuration: '12m',
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('opendev_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('opendev_registered_users_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse registered users', e);
      }
    }
    return DEFAULT_REGISTERED_USERS;
  });

  // 1. Real-time Firestore Users Listener (Like vishwaleader.com)
  useEffect(() => {
    if (!db) return;

    const unsub = onSnapshot(collection(db, "users"), async (snapshot) => {
      if (snapshot.empty) {
        // Seed default users to Firestore so the database is populated with real documents
        try {
          for (const u of DEFAULT_REGISTERED_USERS) {
            await setDoc(doc(db, "users", u.id), {
              ...u,
              lastSeen: new Date().toISOString(),
              joinedAt: u.joinedAt || '2026-01-30',
            }, { merge: true });
          }
        } catch (seedErr) {
          console.warn("Error seeding default users to Firestore:", seedErr);
        }
        return;
      }

      const firestoreUsers: RegisteredUser[] = snapshot.docs.map(d => {
        const data = d.data();
        const lastSeenMs = data.lastSeen?.toMillis
          ? data.lastSeen.toMillis()
          : data.lastSeen
          ? new Date(data.lastSeen).getTime()
          : 0;

        // Dynamic online calculation (Active within last 10 mins = online)
        const isOnline = data.online === true || (lastSeenMs > 0 && (Date.now() - lastSeenMs) < 10 * 60 * 1000);

        let joinedFormatted = '2026-09-01';
        if (data.joinedAt) {
          if (data.joinedAt.toDate) {
            joinedFormatted = data.joinedAt.toDate().toISOString().split('T')[0];
          } else {
            joinedFormatted = String(data.joinedAt).split('T')[0];
          }
        }

        let lastActiveStr = 'Offline';
        if (isOnline) {
          lastActiveStr = 'Online now';
        } else if (lastSeenMs > 0) {
          const diffMins = Math.max(1, Math.round((Date.now() - lastSeenMs) / 60000));
          lastActiveStr = diffMins < 60 ? `${diffMins}m ago` : diffMins < 1440 ? `${Math.round(diffMins / 60)}h ago` : `${Math.round(diffMins / 1440)}d ago`;
        }

        const cleanEmail = (data.email || '').toLowerCase().trim();
        const isDev = cleanEmail === 'opendev-labs.office@gmail.com' || cleanEmail === 'opendev.office@gmail.com' || data.role === 'developer';

        return {
          id: d.id,
          name: data.name || (data.email ? data.email.split('@')[0] : 'OpenDev Member'),
          email: data.email || '',
          avatar: data.avatar || data.photoURL || 'https://lh3.googleusercontent.com/a/default-user',
          joinedAt: joinedFormatted,
          role: (data.role as UserRole) || (isDev ? 'developer' : 'user'),
          clientId: data.clientId,
          online: isOnline,
          team: data.team || (isDev ? 'OpenDev Studio Executive' : 'Google Auth Member'),
          authMethod: data.authMethod || 'google',
          ipAddress: data.ipAddress || '103.15.244.18',
          location: data.location || 'Mumbai, IN',
          lastActive: lastActiveStr,
          sessionDuration: data.sessionDuration || '45m',
        };
      });

      // Sort with lead developer / active users on top
      firestoreUsers.sort((a, b) => {
        if (a.role === 'developer' && b.role !== 'developer') return -1;
        if (b.role === 'developer' && a.role !== 'developer') return 1;
        if (a.online && !b.online) return -1;
        if (!a.online && b.online) return 1;
        return 0;
      });

      setRegisteredUsers(firestoreUsers);
    }, (err) => {
      console.warn("Firestore users listener error:", err);
    });

    return () => unsub();
  }, []);

  // 2. Auth state changed & heartbeat presence
  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const cleanEmail = (firebaseUser.email || '').toLowerCase().trim();
        const isDev = cleanEmail === 'opendev-labs.office@gmail.com' || cleanEmail === 'opendev.office@gmail.com';
        const existingRegistered = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
        const role: UserRole = isDev ? 'developer' : (existingRegistered?.role === 'client' ? 'client' : 'user');

        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Google User'),
          email: firebaseUser.email || '',
          role: role,
          clientId: existingRegistered?.clientId,
          authMethod: 'google',
          avatar: firebaseUser.photoURL || undefined,
        });

        // Update presence in Firestore
        if (db) {
          try {
            await setDoc(doc(db, "users", firebaseUser.uid), {
              online: true,
              lastSeen: serverTimestamp(),
            }, { merge: true });
          } catch (e) {
            console.warn("Presence update error:", e);
          }
        }
      }
    });

    return () => unsubscribeAuth();
  }, [registeredUsers]);

  // Sync current user to localStorage for instant local hydration
  useEffect(() => {
    if (user) {
      localStorage.setItem('opendev_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('opendev_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('opendev_registered_users_v3', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const loginAsDeveloper = () => {
    setUser(DEV_USER);
  };

  const loginAsClient = (clientId: string, clientName?: string, clientEmail?: string) => {
    setUser({
      id: `user-${clientId}`,
      name: clientName || 'Client Partner',
      email: clientEmail || 'client@opendev-labs.com',
      role: 'client',
      clientId: clientId,
      authMethod: 'password',
    });
  };

  const loginWithGoogle = async (
    googleEmail = 'user@gmail.com',
    googleName = 'Google User',
    googleAvatar = 'https://lh3.googleusercontent.com/a/default-user'
  ) => {
    const cleanEmail = googleEmail.toLowerCase().trim();
    const isDev = cleanEmail === 'opendev-labs.office@gmail.com' || cleanEmail === 'opendev.office@gmail.com';
    const existingRegistered = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    const userRole: UserRole = isDev ? 'developer' : (existingRegistered?.role === 'client' ? 'client' : 'user');

    const userId = existingRegistered?.id || `user-g-${Date.now()}`;
    const nameToUse = googleName || (googleEmail.includes('@') ? googleEmail.split('@')[0] : 'Google User');

    const updatedUserRecord: RegisteredUser = {
      id: userId,
      name: nameToUse,
      email: googleEmail,
      avatar: googleAvatar || 'https://lh3.googleusercontent.com/a/default-user',
      joinedAt: existingRegistered?.joinedAt || new Date().toISOString().split('T')[0],
      role: userRole,
      clientId: existingRegistered?.clientId,
      online: true,
      authMethod: 'google',
    };

    // Update in Firestore
    if (db) {
      try {
        await setDoc(doc(db, "users", userId), {
          ...updatedUserRecord,
          lastSeen: serverTimestamp(),
          online: true,
        }, { merge: true });
      } catch (e) {
        console.warn("loginWithGoogle Firestore update error:", e);
      }
    }

    setUser({
      id: userId,
      name: nameToUse,
      email: googleEmail,
      role: userRole,
      clientId: existingRegistered?.clientId,
      authMethod: 'google',
      avatar: googleAvatar,
    });
  };

  const convertRegisteredUserToClient = async (userId: string, clientId: string, clientName?: string) => {
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

    if (db) {
      try {
        await setDoc(doc(db, "users", userId), {
          role: 'client',
          clientId,
          ...(clientName ? { name: clientName } : {})
        }, { merge: true });
      } catch (e) {
        console.warn("convertRegisteredUserToClient Firestore error:", e);
      }
    }

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

  const deleteRegisteredUser = async (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId && u.email !== userId));

    if (db) {
      try {
        await deleteDoc(doc(db, "users", userId));
      } catch (e) {
        console.warn("deleteRegisteredUser Firestore error:", e);
      }
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("Firebase signOut error:", e);
      }
    }
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
