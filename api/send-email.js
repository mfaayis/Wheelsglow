// Vercel Serverless Function — /api/send-email.js
// Handles both order-confirmation and tracking-update emails
// Deployed automatically on Vercel since it's in the /api/ folder

const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.warn('No RESEND_API_KEY set — skipping email');
    return res.status(200).json({ ok: true, skipped: true });
  }

  const resend = new Resend(RESEND_API_KEY);
  const { type, order } = req.body;

  if (!order || !order.customerEmail) {
    return res.status(400).json({ error: 'Missing order data' });
  }

  try {
    if (type === 'order_confirmation') {
      await resend.emails.send({
        from: 'WheelsGlow <onboarding@resend.dev>',
        to: order.customerEmail,
        subject: `Order Confirmed — ${order.id} | WheelsGlow`,
        html: buildOrderConfirmationHTML(order),
      });
    } else if (type === 'tracking_update') {
      await resend.emails.send({
        from: 'WheelsGlow <onboarding@resend.dev>',
        to: order.customerEmail,
        subject: `Order ${order.status} — ${order.id} | WheelsGlow`,
        html: buildTrackingUpdateHTML(order),
      });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: err.message });
  }
};

function wrap(content) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,sans-serif;color:#fff}
    .c{max-width:560px;margin:0 auto;padding:40px 24px}
    .logo{font-size:28px;font-weight:900;letter-spacing:-.05em;text-transform:uppercase;margin-bottom:32px}
    .logo span{color:#FF003D}
    .card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:32px;margin-bottom:24px}
    .badge{display:inline-block;background:rgba(255,0,61,.12);border:1px solid rgba(255,0,61,.25);color:#FF003D;padding:4px 12px;border-radius:20px;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px}
    h1{font-size:22px;font-weight:800;margin:0 0 8px}
    .sub{font-size:13px;color:rgba(255,255,255,.45);line-height:1.6;margin:0}
    hr{border:none;border-top:1px solid rgba(255,255,255,.06);margin:20px 0}
    .row{display:flex;justify-content:space-between;margin-bottom:10px;font-size:13px}
    .lbl{text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.3);font-family:monospace;font-size:10px}
    .btn{display:block;background:#fff;color:#000;text-decoration:none;padding:14px;border-radius:10px;text-align:center;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.1em;margin-top:20px}
    .foot{text-align:center;color:rgba(255,255,255,.2);font-size:11px;font-family:monospace;margin-top:32px;line-height:1.8}
  </style></head><body><div class="c">
    <div class="logo">WHEELS<span>GLOW</span></div>
    ${content}
    <div class="foot">WheelsGlow · Luxury LED Art Posters<br>support@wheelsglow.com · India<br>© 2025 WheelsGlow</div>
  </div></body></html>`;
}

function buildOrderConfirmationHTML(order) {
  return wrap(`
    <div class="card">
      <div class="badge">✅ Order Confirmed</div>
      <h1>Your order is placed!</h1>
      <p class="sub">We've received your WheelsGlow order. Here's a summary and tracking link.</p>
    </div>
    <div class="card">
      <div class="row"><span class="lbl">Order ID</span><span style="font-family:monospace;font-weight:700;font-size:18px;color:#FF003D">${order.id}</span></div>
      <hr>
      <div class="row"><span class="lbl">Product</span><span>${order.productName}</span></div>
      <div class="row"><span class="lbl">Size</span><span>${order.size}</span></div>
      <div class="row"><span class="lbl">Amount</span><span style="font-weight:700">₹${Number(order.amount).toLocaleString('en-IN')}</span></div>
      <div class="row"><span class="lbl">Payment</span><span>Cash on Delivery</span></div>
      <hr>
      <div class="row"><span class="lbl">Name</span><span>${order.customerName}</span></div>
      <div class="row"><span class="lbl">Deliver to</span><span style="text-align:right;max-width:260px">${order.address}, ${order.city} - ${order.pincode}</span></div>
      <a href="https://wheelsglow.vercel.app/track?order=${order.id}" class="btn">Track My Order →</a>
    </div>
    <div class="card">
      <p class="lbl" style="margin-bottom:8px">What's next?</p>
      <p class="sub">1. Printing & assembling your poster (24–48 hrs)<br>2. Picked up by courier & dispatched<br>3. Delivered in 5–7 business days — you'll get email updates!</p>
    </div>
  `);
}

function buildTrackingUpdateHTML(order) {
  const icons = { Dispatched: '📦', 'In Transit': '🚚', Delivered: '🔥', Cancelled: '❌' };
  const titles = {
    Dispatched: 'Your order is dispatched!',
    'In Transit': 'Your order is in transit!',
    Delivered: 'Your order has been delivered!',
    Cancelled: 'Your order has been cancelled',
  };
  const bodies = {
    Dispatched: 'Your WheelsGlow poster has been picked up by our courier and is on its way to you.',
    'In Transit': 'Your poster is en route to your city. Expected delivery in 1–2 business days.',
    Delivered: 'Your LED art poster has arrived! Enjoy the glow. 🔥',
    Cancelled: 'Your order was cancelled. Please contact us if this was a mistake.',
  };
  return wrap(`
    <div class="card">
      <div class="badge">${icons[order.status] || '📦'} ${order.status}</div>
      <h1>${titles[order.status] || 'Order Update'}</h1>
      <p class="sub">${bodies[order.status] || ''}</p>
    </div>
    <div class="card">
      <div class="row"><span class="lbl">Order ID</span><span style="font-family:monospace;font-weight:700;color:#FF003D">${order.id}</span></div>
      <div class="row"><span class="lbl">Product</span><span>${order.productName}</span></div>
      ${order.trackingId ? `<div class="row"><span class="lbl">Courier Tracking</span><span style="font-family:monospace;font-weight:700">${order.trackingId}</span></div>` : ''}
      <a href="https://wheelsglow.vercel.app/track?order=${order.id}" class="btn">View Full Tracking →</a>
    </div>
  `);
}
