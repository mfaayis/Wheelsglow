const express = require('express');
const router = express.Router();
const { sendOrderConfirmation, sendTrackingUpdate } = require('../emailService');

// ── GET /api/orders/:id  (public — for tracking)
router.get('/orders/:id', (req, res) => {
  const { readDB } = require('../db');
  const db = readDB();
  const order = db.orders.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
  // Return limited fields for public tracking (no email)
  const { customerEmail, ...publicOrder } = order;
  res.json({ success: true, data: publicOrder });
});

// ── POST /api/orders  (public — create new order from checkout)
router.post('/orders', (req, res) => {
  const { readDB, writeDB } = require('../db');
  const {
    customerName, customerEmail, customerPhone,
    address, city, state, pincode,
    productId, productName, size, amount, notes
  } = req.body;

  // Basic validation
  if (!customerName || !customerEmail || !customerPhone || !address || !city || !pincode || !productId || !size || !amount) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const db = readDB();
  const orderId = `WG${db.orderCounter}`;

  const newOrder = {
    id: orderId,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    customerPhone: customerPhone.trim(),
    address: address.trim(),
    city: city.trim(),
    state: state?.trim() || '',
    pincode: pincode.trim(),
    productId: parseInt(productId),
    productName: productName || '',
    size,
    amount: parseInt(amount),
    status: 'Processing',
    trackingId: '',
    notes: notes?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  db.orders.push(newOrder);
  db.orderCounter = db.orderCounter + 1;
  writeDB(db);

  console.log(`✅ New order: ${orderId} — ${customerName} — ${productName} (${size}) — ₹${amount}`);

  // Send order confirmation email (non-blocking)
  sendOrderConfirmation(newOrder).catch(err => console.error('Email error:', err));

  res.status(201).json({ success: true, data: { orderId, status: 'Processing' }, message: `Order ${orderId} placed successfully!` });
});

// ── GET /api/admin/orders  (admin only — full list)
router.get('/admin/orders', (req, res) => {
  const { readDB } = require('../db');
  const db = readDB();

  const { status, search, limit = 50, offset = 0 } = req.query;
  let orders = [...db.orders].reverse(); // newest first

  if (status && status !== 'All') {
    orders = orders.filter(o => o.status === status);
  }
  if (search) {
    const s = search.toLowerCase();
    orders = orders.filter(o =>
      o.id.toLowerCase().includes(s) ||
      o.customerName.toLowerCase().includes(s) ||
      o.productName.toLowerCase().includes(s) ||
      o.city.toLowerCase().includes(s)
    );
  }

  const total = orders.length;
  const paginated = orders.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  // Stats
  const allOrders = db.orders;
  const stats = {
    total: allOrders.length,
    revenue: allOrders.reduce((s, o) => s + o.amount, 0),
    delivered: allOrders.filter(o => o.status === 'Delivered').length,
    inTransit: allOrders.filter(o => o.status === 'In Transit' || o.status === 'Dispatched').length,
    processing: allOrders.filter(o => o.status === 'Processing').length,
  };

  res.json({ success: true, data: paginated, total, stats });
});

// ── PATCH /api/admin/orders/:id  (admin — update status / tracking)
router.patch('/admin/orders/:id', (req, res) => {
  const { readDB, writeDB } = require('../db');
  const { status, trackingId } = req.body;

  const VALID_STATUSES = ['Processing', 'Dispatched', 'In Transit', 'Delivered', 'Cancelled'];
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  const db = readDB();
  const idx = db.orders.findIndex(o => o.id === req.params.id.toUpperCase());
  if (idx === -1) return res.status(404).json({ success: false, error: 'Order not found' });

  if (status) db.orders[idx].status = status;
  if (trackingId !== undefined) db.orders[idx].trackingId = trackingId;
  db.orders[idx].updatedAt = new Date().toISOString();
  writeDB(db);

  // Send tracking update email (non-blocking)
  const updatedOrder = db.orders[idx];
  if (status && status !== 'Processing') {
    sendTrackingUpdate(updatedOrder).catch(err => console.error('Email error:', err));
  }

  res.json({ success: true, data: updatedOrder });
});

// ── DELETE /api/admin/orders/:id  (admin)
router.delete('/admin/orders/:id', (req, res) => {
  const { readDB, writeDB } = require('../db');
  const db = readDB();
  const idx = db.orders.findIndex(o => o.id === req.params.id.toUpperCase());
  if (idx === -1) return res.status(404).json({ success: false, error: 'Order not found' });
  db.orders.splice(idx, 1);
  writeDB(db);
  res.json({ success: true, message: 'Order deleted' });
});

module.exports = router;
