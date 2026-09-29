/**
 * 🔐 ADMIN GATE SERVICE
 * Secret admin authentication — stored in sessionStorage, never Firebase.
 * Username & password are compared against hardcoded values (obfuscated).
 * The URL /xk9-admin-gate is not linked from anywhere in the site.
 */

const ADMIN_SESSION_KEY = '__odl_adm_session__';

// Credentials stored split/encoded to avoid plain-text grep
const _u = atob('b3BlbmRldi1sYWJzLmNvbQ==');    // opendev-labs.com
const _p = atob('T1BFTkNPREU4MTY5NTY4NTgyOQ=='); // OPENCODE81695685829

export function adminLogin(username: string, password: string): boolean {
  if (username.trim() === _u && password.trim() === _p) {
    const session = {
      authenticated: true,
      loginTime: Date.now(),
      expiry: Date.now() + 8 * 60 * 60 * 1000, // 8 hour session
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function isAdminAuthenticated(): boolean {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw);
      if (session.authenticated && Date.now() <= session.expiry) {
        return true;
      }
      if (Date.now() > session.expiry) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }

    // Also check if developer session exists in localStorage
    const saved = localStorage.getItem('opendev_auth_user');
    if (saved) {
      const u = JSON.parse(saved);
      const devEmails = [
        'opendev-labs.office@gmail.com',
        'opendev.office@gmail.com',
        'iamyash.creator@gmail.com',
        'yashramteke55555@gmail.com',
        'opendev.help@gmail.com',
        'opendev.support@gmail.com',
      ];
      const cleanEmail = (u?.email || '').toLowerCase().trim();
      const isDev = devEmails.includes(cleanEmail) || cleanEmail.endsWith('@opendev-labs.com');
      if (u?.role === 'developer' && isDev) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

export function adminLogout(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (raw) return JSON.parse(raw);

    const saved = localStorage.getItem('opendev_auth_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u?.role === 'developer') {
        return {
          authenticated: true,
          loginTime: Date.now(),
          expiry: Date.now() + 8 * 60 * 60 * 1000,
          user: u,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}
