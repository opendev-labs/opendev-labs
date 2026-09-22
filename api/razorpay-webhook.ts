import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  // Express/Vercel body parsing fallback
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (webhookSecret) {
    if (!signature) {
      console.warn('⚠️ Missing x-razorpay-signature header');
      return res.status(400).json({ error: 'Missing Razorpay signature' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('❌ Invalid Razorpay webhook signature');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
    console.log('✅ Razorpay webhook signature verified successfully');
  } else {
    console.warn('⚠️ RAZORPAY_WEBHOOK_SECRET is not set in environment. Skipping signature check.');
  }

  const event = req.body?.event;
  const payload = req.body?.payload;

  console.log(`[Razorpay Webhook] Received Event: ${event}`);

  try {
    switch (event) {
      case 'payment.captured': {
        const payment = payload?.payment?.entity;
        console.log(`✅ Payment Captured! ID: ${payment?.id}, Amount: ${payment?.amount ? payment.amount / 100 : 0} ${payment?.currency}, Email: ${payment?.email}`);
        break;
      }
      case 'payment.failed': {
        const payment = payload?.payment?.entity;
        console.error(`❌ Payment Failed! ID: ${payment?.id}, Reason: ${payment?.error_description}`);
        break;
      }
      case 'order.paid': {
        const order = payload?.order?.entity;
        const payment = payload?.payment?.entity;
        console.log(`🎉 Order Paid! Order ID: ${order?.id}, Payment ID: ${payment?.id}`);
        break;
      }
      case 'subscription.charged': {
        const subscription = payload?.subscription?.entity;
        const payment = payload?.payment?.entity;
        console.log(`🔄 Subscription Charged! ID: ${subscription?.id}, Payment ID: ${payment?.id}`);
        break;
      }
      case 'subscription.activated': {
        const subscription = payload?.subscription?.entity;
        console.log(`🚀 Subscription Activated! ID: ${subscription?.id}`);
        break;
      }
      case 'subscription.halted':
      case 'subscription.cancelled': {
        const subscription = payload?.subscription?.entity;
        console.warn(`⚠️ Subscription Status (${event})! ID: ${subscription?.id}`);
        break;
      }
      default:
        console.log(`ℹ️ Event: ${event}`);
    }

    return res.status(200).json({ status: 'ok', received: true, event });
  } catch (err: any) {
    console.error('Error handling Razorpay webhook:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
