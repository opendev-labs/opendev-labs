/**
 * RAZORPAY & UPI PAYMENT GATEWAY CONTROLLER
 * Handles live subscription materialization, international checkout, and preferred India UPI payments.
 */

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TeHfR3oT5qWEH8';
export const PREFERRED_UPI_ID = import.meta.env.VITE_PREFERRED_UPI_ID || '8169568582@kotakbank';
export const PREFERRED_UPI_NAME = import.meta.env.VITE_PREFERRED_UPI_NAME || 'Yash Ramteke (Kotak Mahindra Bank)';

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    limits: {
      projects: 3,
      storage: '100MB',
      aiCalls: 50,
      agentInteractions: 100,
    }
  },
  PRO: {
    name: 'Pro',
    price: 999, // ₹999/month (~$12)
    priceId: 'pro_monthly',
    limits: {
      projects: 'unlimited',
      storage: '10GB',
      aiCalls: 5000,
      agentInteractions: 'unlimited',
      features: ['deployments', 'custom-domain', 'priority-support']
    }
  },
  TEAM: {
    name: 'Team',
    price: 4999, // ₹4,999/month (~$60)
    priceId: 'team_monthly',
    limits: {
      projects: 'unlimited',
      storage: '100GB',
      aiCalls: 50000,
      seats: 5,
      features: ['deployments', 'custom-domain', 'priority-support', 'analytics']
    }
  }
};

/**
 * Dynamically loads official Razorpay Checkout SDK script
 */
export function loadRazorpaySDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayModalOptions {
  amount: number; // in INR or USD
  currency?: string; // 'INR' | 'USD'
  name?: string;
  email?: string;
  description?: string;
  orderId?: string;
  onSuccess?: (response: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => void;
  onDismiss?: () => void;
}

/**
 * Opens official Razorpay Checkout modal with Live Key ID
 */
export async function openRazorpayCheckout(options: RazorpayModalOptions): Promise<void> {
  const isLoaded = await loadRazorpaySDK();
  if (!isLoaded) {
    alert('Could not load Razorpay SDK. Please check your internet connection.');
    return;
  }

  const razorpayOptions: any = {
    key: RAZORPAY_KEY_ID,
    name: 'opendev-labs',
    amount: Math.round(options.amount * 100), // amount in smallest currency unit (paise / cents)
    currency: options.currency || 'INR',
    ...(options.description && { description: options.description }),
    prefill: {
      name: options.name || 'Client Partner',
      email: options.email || 'opendev.office@gmail.com',
      contact: '+918169568582',
    },
    notes: {
      merchant: 'opendev-labs',
      upi_vpa: PREFERRED_UPI_ID,
    },
    handler: function (response: any) {
      console.log('✅ Razorpay Live Payment Successful:', response);
      if (options.onSuccess) {
        options.onSuccess(response);
      }
    },
    modal: {
      ondismiss: function () {
        console.log('⚠️ Razorpay Modal Dismissed by User');
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
  };

  razorpayOptions.name = 'opendev-labs';

  const rzp = new (window as any).Razorpay(razorpayOptions);
  rzp.open();
}

/**
 * Helper function for backward compatibility
 */
export async function createSubscription(tier: keyof typeof SUBSCRIPTION_TIERS): Promise<any> {
  const tierData = SUBSCRIPTION_TIERS[tier];
  return new Promise((resolve, reject) => {
    openRazorpayCheckout({
      amount: tierData.price,
      currency: 'INR',
      description: `${tierData.name} Subscription Plan`,
      onSuccess: (res) => resolve({ success: true, ...res }),
      onDismiss: () => reject(new Error('Payment cancelled')),
    });
  });
}
