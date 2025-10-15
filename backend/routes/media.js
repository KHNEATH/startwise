
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Upload media
router.post('/', async (req, res) => {
  const { user_id, url, type } = req.body;
  try {
    await db.query('INSERT INTO media (user_id, url, type) VALUES (?, ?, ?)', [user_id, url, type]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// Get all media
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM media ORDER BY uploaded_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Update media
router.put('/:id', async (req, res) => {
  const { url, type } = req.body;
  try {
    await db.query('UPDATE media SET url = ?, type = ? WHERE id = ?', [url, type, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update media' });
  }
});

// Delete media
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM media WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

module.exports = router;
