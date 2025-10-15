const express = require('express');
const Achievement = require('../models/Achievement');
const router = express.Router();

router.get('/', async (req, res) => {
  const achievements = await Achievement.find();
  res.json(achievements);
});

// Create achievement
router.post('/', async (req, res) => {
  const achievement = new Achievement(req.body);
  await achievement.save();
  res.status(201).json(achievement);
});

// Update achievement
router.put('/:id', async (req, res) => {
  const { title, description, achieved_at } = req.body;
  try {
    await db.query('UPDATE achievements SET title = ?, description = ?, achieved_at = ? WHERE id = ?', [title, description, achieved_at, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

// Delete achievement
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM achievements WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

module.exports = router;
