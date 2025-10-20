const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Create contact message
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)', 
      [name, email, phone, message]
    );
    console.log('Contact message saved:', { name, email });
    res.status(201).json({ success: true, message: 'Contact message sent successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to save contact message' });
  }
});

// Get all contact messages
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY submitted_at DESC');
    res.json(result[0]); // MySQL returns [rows, fields]
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

module.exports = router;
