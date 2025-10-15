const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Create or update CV
router.post('/', async (req, res) => {
  const { userId, cv } = req.body;
  if (!userId || !cv) {
    return res.status(400).json({ error: 'userId and cv required' });
  }
  try {
    // Get existing profile_json
    const [existing] = await pool.query(
      'SELECT profile_json FROM users WHERE id = ?',
      [userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Merge CV data with existing profile_json
    let profileData = {};
    try {
      profileData = existing[0].profile_json ? JSON.parse(existing[0].profile_json) : {};
    } catch (e) {
      profileData = {};
    }
    
    profileData.cv = cv;
    
    // Update with merged data
    const [result] = await pool.query(
      'UPDATE users SET profile_json = ? WHERE id = ?',
      [JSON.stringify(profileData), userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, cv: cv });
  } catch (err) {
    console.error('CV save error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get user's CV (current user)
router.get('/', async (req, res) => {
  // TODO: Get userId from JWT token instead of hardcoding
  const userId = 1;
  try {
    const [result] = await pool.query(
      'SELECT profile_json FROM users WHERE id = ?',
      [userId]
    );
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    let profileData = {};
    try {
      profileData = result[0].profile_json ? JSON.parse(result[0].profile_json) : {};
    } catch (e) {
      profileData = {};
    }
    
    res.json({ cv: profileData.cv || {} });
  } catch (err) {
    console.error('CV get error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// View CV by ID
router.get('/view/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [result] = await pool.query(
      'SELECT profile_json FROM users WHERE id = ?',
      [userId]
    );
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    let profileData = {};
    try {
      profileData = result[0].profile_json ? JSON.parse(result[0].profile_json) : {};
    } catch (e) {
      profileData = {};
    }
    
    res.json({ cv: profileData.cv || {} });
  } catch (err) {
    console.error('CV view error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
