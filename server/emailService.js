// Email Service — uses Resend API for transactional emails
// Free tier: 3000 emails/month at resend.com
// Set RESEND_API_KEY in server/.env

const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = 'WheelsGlow <orders@wheelsglow.com>';
// During testing / if domain not verified, use: onboarding@resend.dev

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// ── Base email template
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <style>
    body { margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #ffffff; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; margin-bottom: 32px; }
    .logo span { color: #FF003D; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; margin-bottom: 24px; }
    .badge { display: inline-block; background: rgba(255,0,61,0.12); border: 1px solid rgba(255,0,61,0.25); color: #FF003D; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
    .heading { font-size: 24px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
    .sub { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.6; margin: 0; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 24px 0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); font-family: monospace; }
    .value { font-size: 13px; text-align: right; }
    .order-id { font-size: 22px; font-weight: 900; font-family: monospace; letter-spacing: 0.05em; }
    .btn { display: block; background: #ffffff; color: #000000; text-decoration: none; padding: 14px; border-radius: 10px; text-align: center; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 20px; }
    .btn:hover { background: #FF003D; color: #fff; }
    .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
    .footer { text-align: center; color: rgba(255,255,255,0.2); font-size: 11px; font-family: monospace; margin-top: 32px; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">WHEELS<span>GLOW</span></div>
    ${content}
    <div class="footer">
      WheelsGlow · Luxury LED Art Posters<br>
      India · support@wheelsglow.com<br>
      © 2025 WheelsGlow. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

// ── 1. Order Confirmation Email
const sendOrderConfirmation = async (order) => {
  if (!resend) {
    console.log('⚠️  Email skipped (no RESEND_API_KEY). Order:', order.id);
    return;
  }

  const html = baseTemplate(`
    <div class="card">
      <div class="badge">✅ Order Confirmed</div>
      <h1 class="heading">Your order is placed!</h1>
      <p class="sub">We've received your order and are preparing your LED art poster. You'll get tracking updates here.</p>
    </div>

    <div class="card">
      <div class="row">
        <span class="label">Order ID</span>
        <span class="order-id">${order.id}</span>
      </div>
      <hr class="divider">
      <div class="row">
        <span class="label">Product</span>
        <span class="value">${order.productName}</span>
      </div>
      <div class="row">
        <span class="label">Size</span>
        <span class="value">${order.size}</span>
      </div>
      <div class="row">
        <span class="label">Amount</span>
        <span class="value" style="font-weight:700">₹${order.amount?.toLocaleString('en-IN')}</span>
      </div>
      <div class="row">
        <span class="label">Payment</span>
        <span class="value">Cash on Delivery</span>
      </div>
      <hr class="divider">
      <div class="row">
        <span class="label">Deliver to</span>
        <span class="value">${order.customerName}</span>
      </div>
      <div class="row">
        <span class="label">Address</span>
        <span class="value" style="max-width:240px;text-align:right">${order.address}, ${order.city}, ${order.state} - ${order.pincode}</span>
      </div>
      <a href="https://wheelsglow.vercel.app/track?order=${order.id}" class="btn">Track My Order →</a>
    </div>

    <div class="card">
      <p class="label" style="margin-bottom:8px">What happens next?</p>
      <p class="sub">1. We'll print & assemble your poster (24–48 hrs)<br>2. Picked up by courier and dispatched<br>3. Delivered to your door in 5–7 business days</p>
      <p class="sub" style="margin-top:12px">Questions? WhatsApp us or email support@wheelsglow.com</p>
    </div>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.id} | WheelsGlow`,
    html,
  });

  console.log(`✅ Order confirmation sent to ${order.customerEmail}`);
};

// ── 2. Tracking Update Email
const STATUS_COLORS = {
  'Dispatched':  { bg: 'rgba(255,107,0,0.12)', border: 'rgba(255,107,0,0.3)', color: '#FF6B00' },
  'In Transit':  { bg: 'rgba(0,191,255,0.12)', border: 'rgba(0,191,255,0.3)', color: '#00BFFF' },
  'Delivered':   { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' },
  'Cancelled':   { bg: 'rgba(255,0,61,0.12)',  border: 'rgba(255,0,61,0.3)',  color: '#FF003D' },
};

const STATUS_MESSAGES = {
  'Dispatched':  { icon: '📦', title: 'Your order is dispatched!',     body: 'Your WheelsGlow poster has been picked up by our courier partner and is on its way.' },
  'In Transit':  { icon: '🚚', title: 'Your order is in transit!',     body: 'Your poster is currently travelling to your city. Expected delivery in 1–2 business days.' },
  'Delivered':   { icon: '🔥', title: 'Your order is delivered!',      body: 'Your WheelsGlow LED art poster has been delivered. Enjoy the glow!' },
  'Cancelled':   { icon: '❌', title: 'Your order has been cancelled', body: 'Your order has been cancelled. If this was a mistake, please contact us immediately.' },
};

const sendTrackingUpdate = async (order) => {
  if (!resend || !order.customerEmail) {
    console.log('⚠️  Tracking email skipped. Order:', order.id, 'Status:', order.status);
    return;
  }

  const statusMsg = STATUS_MESSAGES[order.status];
  if (!statusMsg) return; // Don't send for 'Processing' — already sent confirmation

  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS['In Transit'];

  const html = baseTemplate(`
    <div class="card">
      <div class="badge">${statusMsg.icon} ${order.status}</div>
      <h1 class="heading">${statusMsg.title}</h1>
      <p class="sub">${statusMsg.body}</p>
    </div>

    <div class="card">
      <div class="row">
        <span class="label">Order ID</span>
        <span class="order-id" style="color:#FF003D">${order.id}</span>
      </div>
      <div class="row">
        <span class="label">Product</span>
        <span class="value">${order.productName}</span>
      </div>
      <div class="row">
        <span class="label">Status</span>
        <span class="status-badge" style="background:${statusStyle.bg};border:1px solid ${statusStyle.border};color:${statusStyle.color}">${order.status}</span>
      </div>
      ${order.trackingId ? `
      <div class="row">
        <span class="label">Courier Tracking</span>
        <span class="value" style="font-family:monospace;font-weight:700">${order.trackingId}</span>
      </div>
      ` : ''}
      <a href="https://wheelsglow.vercel.app/track?order=${order.id}" class="btn">View Full Tracking →</a>
    </div>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customerEmail,
    subject: `${statusMsg.icon} Order ${order.status} — ${order.id} | WheelsGlow`,
    html,
  });

  console.log(`✅ Tracking update (${order.status}) sent to ${order.customerEmail}`);
};

module.exports = { sendOrderConfirmation, sendTrackingUpdate };
