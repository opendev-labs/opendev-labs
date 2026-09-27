/**
 * Shared Session and Cross-Subdomain Auth Utility for OpenStudio
 * Enables secure sovereign session synchronization across opendev-labs.com
 * and openstudio.opendev-labs.com
 */

export interface SovereignSessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  githubHandle?: string;
  authMethod?: string;
  timestamp?: number;
}

const COOKIE_NAME = 'opendev_session';

function getCookieDomain(): string {
  const hostname = window.location.hostname;
  if (hostname.includes('opendev-labs.com')) {
    return '; domain=.opendev-labs.com';
  }
  return '';
}

export function setSessionCookie(user: SovereignSessionUser) {
  try {
    const payload = encodeURIComponent(JSON.stringify({ ...user, timestamp: Date.now() }));
    const domain = getCookieDomain();
    const isSecure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE_NAME}=${payload}; path=/; max-age=2592000${domain}; SameSite=Lax${isSecure}`;
    localStorage.setItem('opendev_auth_user', JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to set session cookie:', e);
  }
}

export function getSessionUser(): SovereignSessionUser | null {
  try {
    // 1. Check URL hash for handoff token (#opendev_auth=...)
    if (window.location.hash && window.location.hash.includes('opendev_auth=')) {
      const match = window.location.hash.match(/opendev_auth=([^&]+)/);
      if (match && match[1]) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(match[1])));
          const parsed = JSON.parse(jsonStr);
          if (parsed && (parsed.id || parsed.uid)) {
            const user: SovereignSessionUser = {
              id: parsed.id || parsed.uid,
              name: parsed.name || parsed.displayName || 'Member',
              email: parsed.email || '',
              role: parsed.role || 'user',
              avatar: parsed.avatar || parsed.avatarUrl || parsed.photoURL,
              githubHandle: parsed.githubHandle,
              authMethod: parsed.authMethod,
            };
            setSessionCookie(user);
            // Clean URL hash without reloading
            const cleanUrl = window.location.pathname + window.location.search;
            window.history.replaceState(null, '', cleanUrl);
            return user;
          }
        } catch (err) {
          console.warn('Failed to parse handoff token:', err);
        }
      }
    }

    // 2. Try Cookie
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === COOKIE_NAME && val) {
        const decoded = JSON.parse(decodeURIComponent(val));
        if (decoded && (decoded.id || decoded.uid)) return decoded;
      }
    }

    // 3. Try localStorage
    const saved = localStorage.getItem('opendev_auth_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.id || parsed.uid)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to get session user:', e);
  }
  return null;
}

export function clearSessionCookie() {
  try {
    const domain = getCookieDomain();
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0${domain}`;
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
    localStorage.removeItem('opendev_auth_user');
    localStorage.removeItem('opendev_gh_token');
  } catch (e) {
    console.warn('Failed to clear session cookie:', e);
  }
}

export function getAuthRedirectUrl(preserveRedirect: boolean = true): string {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // Auth is ALWAYS handled by the main opendev-labs.com domain.
  // On localhost: main portal runs on 5173, openstudio on 5174.
  const baseAuthUrl = isLocal ? 'http://localhost:5173/auth' : 'https://www.opendev-labs.com/auth';
  if (!preserveRedirect) {
    return baseAuthUrl;
  }
  const redirectBack = window.location.href;
  return `${baseAuthUrl}?redirect=${encodeURIComponent(redirectBack)}`;
}


export function getOpenStudioUrl(path: string = '', query: string = ''): string {
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const base = isLocal ? 'http://localhost:5174' : 'https://openstudio.opendev-labs.com';
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const cleanQuery = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  return `${base}${cleanPath}${cleanQuery}`;
}

export function getMainDomainUrl(path: string = ''): string {
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const base = isLocal ? 'http://localhost:5173' : 'https://www.opendev-labs.com';
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${base}${cleanPath}`;
}

export function getAdminPanelUrl(): string {
  return getMainDomainUrl('/admin');
}
