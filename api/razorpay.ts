import Razorpay from 'razorpay';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeyId || !razorpayKeySecret) {
    return new Response(JSON.stringify({ error: 'Razorpay keys not configured' }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const instance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });

  try {
    const options = {
      amount: 900, // $9.00 in cents, Razorpay handles currency, assuming USD here
      currency: "USD",
      receipt: "receipt_order_" + Math.random().toString(36).substring(2, 10),
    };

    const order = await instance.orders.create(options);
    
    return new Response(JSON.stringify(order), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
