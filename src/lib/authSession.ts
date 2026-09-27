/**
 * Shared Session and Cross-Subdomain Auth Utility for OpenDev-Labs
 * Enables secure sovereign session synchronization across opendev-labs.com,
 * openstudio.opendev-labs.com, and local development environments.
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

/**
 * Get top-level domain for cookie sharing (e.g. .opendev-labs.com)
 */
function getCookieDomain(): string {
  const hostname = window.location.hostname;
  if (hostname.includes('opendev-labs.com')) {
    return '; domain=.opendev-labs.com';
  }
  return '';
}

/**
 * Set cross-domain session cookie
 */
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

/**
 * Read session from cookie or localStorage
 */
export function getSessionUser(): SovereignSessionUser | null {
  try {
    // 1. Try Cookie
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === COOKIE_NAME && val) {
        const decoded = JSON.parse(decodeURIComponent(val));
        if (decoded && decoded.id) return decoded;
      }
    }

    // 2. Try localStorage
    const saved = localStorage.getItem('opendev_auth_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id) return parsed;
    }
  } catch (e) {
    console.warn('Failed to get session user:', e);
  }
  return null;
}

/**
 * Clear session cookie and storage
 */
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

/**
 * Generate handoff URL with token hash for seamless redirection
 */
export function createHandoffUrl(targetUrl: string, user: SovereignSessionUser): string {
  try {
    const token = btoa(unescape(encodeURIComponent(JSON.stringify(user))));
    const url = new URL(targetUrl, window.location.origin);
    url.hash = `opendev_auth=${token}`;
    return url.toString();
  } catch (e) {
    return targetUrl;
  }
}

/**
 * Dynamically resolves OpenStudio URL depending on environment:
 * Returns http://localhost:5174 in local development,
 * and https://openstudio.opendev-labs.com in production.
 */
export function getOpenStudioUrl(path: string = '', query: string = ''): string {
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const base = isLocal ? 'http://localhost:5174' : 'https://openstudio.opendev-labs.com';
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const cleanQuery = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  return `${base}${cleanPath}${cleanQuery}`;
}

export function getAuthRedirectUrl(): string {
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const baseAuthUrl = isLocal ? 'http://localhost:5173/auth' : 'https://www.opendev-labs.com/auth';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  return `${baseAuthUrl}?redirect=${encodeURIComponent(currentUrl)}`;
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
