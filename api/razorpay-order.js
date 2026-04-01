const Razorpay = require('razorpay');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  // Use either the VITE prefixed ID or standard. Secret must only be on the server.
  const key_id = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error('Missing Razorpay credentials in environment variables.');
    return res.status(500).json({ error: 'Payment gateway configuration missing' });
  }

  try {
    const razorpay = new Razorpay({ key_id, key_secret });

    // Razorpay operates in paise (smallest currency unit), so multiply INR by 100
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `wg_rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    // Return only necessary fields to the frontend
    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
    
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
}
