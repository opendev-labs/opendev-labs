/**
 * MULTI-CURRENCY INTEGRATION CONTROLLER FOR RAZORPAY & OPENDEV-LABS
 * Supports USD, INR, GBP, EUR, AED, SGD, JPY, CAD, AUD, CHF
 */

export type SupportedCurrency =
  | 'USD'
  | 'INR'
  | 'GBP'
  | 'EUR'
  | 'AED'
  | 'SGD'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF';

export interface CurrencyDetail {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
  rateVsUSD: number; // Conversion factor relative to USD (USD = 1)
  rateVsINR: number; // Conversion factor relative to INR (INR = 80)
  zeroDecimal?: boolean; // True for currencies with no subunit like JPY
}

export const SUPPORTED_CURRENCIES: CurrencyDetail[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateVsUSD: 1, rateVsINR: 1 / 80 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rateVsUSD: 80, rateVsINR: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateVsUSD: 0.92, rateVsINR: 0.92 / 80 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateVsUSD: 0.78, rateVsINR: 0.78 / 80 },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', flag: '🇦🇪', rateVsUSD: 3.67, rateVsINR: 3.67 / 80 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rateVsUSD: 1.35, rateVsINR: 1.35 / 80 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rateVsUSD: 145, rateVsINR: 145 / 80, zeroDecimal: true },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', rateVsUSD: 1.36, rateVsINR: 1.36 / 80 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rateVsUSD: 1.50, rateVsINR: 1.50 / 80 },
  { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc', flag: '🇨🇭', rateVsUSD: 0.86, rateVsINR: 0.86 / 80 },
];

export const CURRENCY_MAP: Record<SupportedCurrency, CurrencyDetail> = SUPPORTED_CURRENCIES.reduce(
  (acc, curr) => ({ ...acc, [curr.code]: curr }),
  {} as Record<SupportedCurrency, CurrencyDetail>
);

/**
 * Converts a base USD amount to target currency.
 * For INR, uses exact clean rounded pricing matching native INR tiers ($50 = ₹4,000).
 */
export function convertFromUSD(usdAmount: number, targetCurrency: SupportedCurrency): number {
  if (targetCurrency === 'USD') return usdAmount;
  
  if (targetCurrency === 'INR') {
    // Exact mapping for standard plan numbers
    const inrMap: Record<number, number> = {
      50: 4000,
      500: 40000,
      75: 6000,
      800: 64000,
      100: 8000,
      1100: 88000,
      125: 10000,
      1350: 110000,
    };
    if (inrMap[usdAmount]) return inrMap[usdAmount];
  }

  const detail = CURRENCY_MAP[targetCurrency] || CURRENCY_MAP.USD;
  const converted = usdAmount * detail.rateVsUSD;

  if (detail.zeroDecimal) {
    // Round JPY to nearest 50 or 100 for clean pricing
    return Math.round(converted / 50) * 50;
  }

  // Round up to clean integer numbers for user-friendly pricing displays
  return Math.round(converted);
}

/**
 * Converts a base INR amount to target currency.
 */
export function convertFromINR(inrAmount: number, targetCurrency: SupportedCurrency): number {
  if (targetCurrency === 'INR') return inrAmount;
  const usdAmount = inrAmount / 80;
  return convertFromUSD(usdAmount, targetCurrency);
}

/**
 * Formats an amount with the correct symbol and number formatting for a given currency
 */
export function formatCurrencyPrice(amount: number, currency: SupportedCurrency): string {
  const detail = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const formattedNum = amount.toLocaleString('en-US');
  return `${detail.symbol}${formattedNum}`;
}

/**
 * Converts amount into smallest unit required by Razorpay API
 * 2-decimal currencies (USD, INR, EUR, GBP, AED, SGD, CAD, AUD, CHF) -> amount * 100
 * Zero-decimal currencies (JPY) -> amount
 */
export function getRazorpaySubunitAmount(amount: number, currency: SupportedCurrency): number {
  const detail = CURRENCY_MAP[currency] || CURRENCY_MAP.INR;
  if (detail.zeroDecimal) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
}
