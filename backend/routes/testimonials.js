const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create testimonial
router.post('/', async (req, res) => {
  const { user_id, content } = req.body;
  try {
    await db.query('INSERT INTO testimonials (user_id, content) VALUES (?, ?)', [user_id, content]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save testimonial' });
  }
});

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Update testimonial
router.put('/:id', async (req, res) => {
  const { content } = req.body;
  try {
    await db.query('UPDATE testimonials SET content = ? WHERE id = ?', [content, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

module.exports = router;

router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find();
  res.json(testimonials);
});

router.post('/', async (req, res) => {
  const testimonial = new Testimonial(req.body);
  await testimonial.save();
  res.status(201).json(testimonial);
});

module.exports = router;
