const express = require('express');
const router = express.Router();

// POST /api/contact
router.post('/contact', (req, res) => {
  const { readDB, writeDB } = require('../db');
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required' });
  }

  const db = readDB();
  if (!db.contacts) db.contacts = [];

  const contact = {
    id: db.contacts.length + 1,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || '',
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  db.contacts.push(contact);
  writeDB(db);

  console.log(`📧 Contact: ${name} <${email}>`);
  res.status(201).json({ success: true, message: "We'll get back to you within 24 hours!" });
});

// GET /api/admin/contacts
router.get('/admin/contacts', (req, res) => {
  const { readDB } = require('../db');
  const db = readDB();
  const contacts = [...(db.contacts || [])].reverse();
  res.json({ success: true, data: contacts });
});

module.exports = router;
