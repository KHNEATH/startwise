const express = require('express');
const router = express.Router();
const { getPool } = require('../db');
const authenticateToken = require('../middleware/auth');

// Get current user's profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const userId = req.user.id;
    const [result] = await pool.execute(
      `SELECT id, username, email, role, first_name, last_name, phone, bio, location, profile_picture FROM users WHERE id = ?`,
      [userId]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result[0];
    res.json({
      id: user.id,
      username: user.username,
      name: user.username, // For backward compatibility
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      profile_picture: user.profile_picture
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Create or update user profile
router.post('/create', authenticateToken, async (req, res) => {
  const { profile } = req.body;
  const userId = req.user.id; // Get userId from authenticated token
  if (!profile) {
    return res.status(400).json({ error: 'profile data required' });
  }
  try {
    const pool = getPool();
    // Update user profile fields
    const [result] = await pool.execute(
      `UPDATE users SET first_name = ?, last_name = ?, phone = ?, bio = ?, location = ? WHERE id = ?`,
      [profile.first_name, profile.last_name, profile.phone, profile.bio, profile.location, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, profile: profile });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Legacy route for backward compatibility (without auth)
router.post('/', async (req, res) => {
  const { userId, profile } = req.body;
  if (!userId || !profile) {
    return res.status(400).json({ error: 'userId and profile required' });
  }
  try {
    const pool = getPool();
    // Update user profile fields
    const [result] = await pool.execute(
      `UPDATE users SET first_name = ?, last_name = ?, phone = ?, bio = ?, location = ? WHERE id = ?`,
      [profile.first_name, profile.last_name, profile.phone, profile.bio, profile.location, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, profile: profile });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// View user profile
router.get('/view/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const pool = getPool();
    const [result] = await pool.execute(
      `SELECT id, username, email, first_name, last_name, phone, bio, location, profile_picture FROM users WHERE id = ?`,
      [userId]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      profile_picture: user.profile_picture
    });
  } catch (err) {
    console.error('Profile view error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
