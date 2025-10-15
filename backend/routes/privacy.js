const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Store user consent
router.post('/consent', async (req, res) => {
  const { user_id, consent_given } = req.body;
  try {
    await db.query('INSERT INTO privacy_consents (user_id, consent_given) VALUES (?, ?)', [user_id, consent_given]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store consent' });
  }
});

// Get all consents
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM privacy_consents ORDER BY consented_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch consents' });
  }
});

module.exports = router;
