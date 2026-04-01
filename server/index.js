const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_KEY = process.env.ADMIN_KEY || 'wg-admin-2026';

// ── Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Admin auth middleware
app.use('/api/admin', (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

// ── Routes
app.use('/api', productsRouter);
app.use('/api', ordersRouter);
app.use('/api', contactRouter);

// ── Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'WheelsGlow API', version: '1.0.0', time: new Date().toISOString() });
});

// ── 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🔥 WheelsGlow API running on http://localhost:${PORT}`);
  console.log(`   Admin key: ${ADMIN_KEY}`);
  console.log(`   Health:    http://localhost:${PORT}/api/health\n`);
});
