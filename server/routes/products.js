const express = require('express');
const router = express.Router();

// GET /api/products
router.get('/products', (req, res) => {
  const { readDB } = require('../db');
  const db = readDB();
  res.json({ success: true, data: db.products });
});

// GET /api/products/:id
router.get('/products/:id', (req, res) => {
  const { readDB } = require('../db');
  const db = readDB();
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: product });
});

module.exports = router;
