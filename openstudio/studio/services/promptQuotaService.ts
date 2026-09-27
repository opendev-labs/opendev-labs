/**
 * OPENSTUDIO PROMPT QUOTA SERVICE
 * Enforces 6 daily prompts for free users, with auto-reset at midnight.
 * Pro users have unlimited prompts.
 */

const STORAGE_KEY = 'openstudio_prompt_quota';
const PRO_STATUS_KEY = 'openstudio_is_pro';
export const DAILY_PROMPT_LIMIT = 6;

export interface QuotaInfo {
  used: number;
  total: number;
  remaining: number;
  isLocked: boolean;
  isPro: boolean;
  resetDate: string;
  hoursUntilReset: number;
}

export type PromptQuota = QuotaInfo;

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function isUserPro(): boolean {
  try {
    const proVal = localStorage.getItem(PRO_STATUS_KEY);
    if (proVal === 'true') return true;

    // Also check auth session user plan if available
    const authSession = localStorage.getItem('opendev_auth_session') || localStorage.getItem('auth_user');
    if (authSession) {
      const parsed = JSON.parse(authSession);
      if (parsed?.plan === 'pro' || parsed?.role === 'pro' || parsed?.isPro) {
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

export function setUserPro(isPro: boolean): void {
  try {
    localStorage.setItem(PRO_STATUS_KEY, isPro ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function getPromptQuota(): QuotaInfo {
  const isPro = isUserPro();
  if (isPro) {
    return {
      used: 0,
      total: Infinity,
      remaining: Infinity,
      isLocked: false,
      isPro: true,
      resetDate: getTodayString(),
      hoursUntilReset: 24,
    };
  }

  const today = getTodayString();
  let used = 0;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) {
        used = typeof data.used === 'number' ? data.used : 0;
      } else {
        // New day! Reset counter
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, used: 0 }));
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, used: 0 }));
    }
  } catch {
    used = 0;
  }

  const remaining = Math.max(0, DAILY_PROMPT_LIMIT - used);
  const isLocked = remaining <= 0;

  // Calculate hours until midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diffHours = Math.max(1, Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60)));

  return {
    used,
    total: DAILY_PROMPT_LIMIT,
    remaining,
    isLocked,
    isPro: false,
    resetDate: today,
    hoursUntilReset: diffHours,
  };
}

export function consumePromptQuota(): { success: boolean; quota: QuotaInfo } {
  const current = getPromptQuota();
  if (current.isPro) {
    return { success: true, quota: current };
  }

  if (current.isLocked) {
    return { success: false, quota: current };
  }

  const today = getTodayString();
  const newUsed = current.used + 1;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, used: newUsed }));
  } catch {
    // ignore
  }

  return {
    success: true,
    quota: getPromptQuota(),
  };
}

export function openPricingPage(): void {
  try {
    if (window.location.port === '5174') {
      window.location.href = 'http://localhost:5173/pricing';
      return;
    }
    window.location.href = '/pricing';
  } catch {
    window.location.href = '/pricing';
  }
}

