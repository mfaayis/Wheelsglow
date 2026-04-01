import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required Razorpay parameters' });
  }

  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_secret) {
    console.error('Missing Razorpay SECRET in environment variables.');
    return res.status(500).json({ error: 'Payment gateway configuration missing' });
  }

  try {
    // Generate signature using hmac sha256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Signature is valid!
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      // Security warning
      console.warn("Invalid payment signature detected", { razorpay_order_id });
      return res.status(400).json({ success: false, error: "Invalid payment signature" });
    }
  } catch (error) {
    console.error('Signature verification failed:', error);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
}
