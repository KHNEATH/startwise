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
    
    // Parse bio if it contains structured data
    let bioData = {};
    try {
      if (user.bio) {
        bioData = JSON.parse(user.bio);
      }
    } catch (e) {
      // If bio is not JSON, treat as regular bio text
      bioData = { bio: user.bio };
    }
    
    res.json({
      id: user.id,
      username: user.username,
      name: user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user.username, // Combine first and last name
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      profile_picture: user.profile_picture,
      // Include structured data from bio
      education: bioData.education,
      skills: bioData.skills,
      age: bioData.age
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
    
    // Handle different data structures - ProfileBuilder sends { name, education, skills, location, age }
    // but we also need to support { first_name, last_name, phone, bio, location }
    let updateFields = [];
    let updateValues = [];
    
    if (profile.name) {
      // Split name into first_name and last_name
      const nameParts = profile.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      updateFields.push('first_name = ?', 'last_name = ?');
      updateValues.push(firstName, lastName);
    }
    
    if (profile.first_name !== undefined && profile.first_name !== null) {
      updateFields.push('first_name = ?');
      updateValues.push(profile.first_name || '');
    }
    
    if (profile.last_name !== undefined && profile.last_name !== null) {
      updateFields.push('last_name = ?');
      updateValues.push(profile.last_name || '');
    }
    
    if (profile.phone !== undefined && profile.phone !== null) {
      updateFields.push('phone = ?');
      updateValues.push(profile.phone || null);
    }
    
    if (profile.bio !== undefined && profile.bio !== null) {
      updateFields.push('bio = ?');
      updateValues.push(profile.bio || null);
    }
    
    // Handle education, skills, age - store in bio field as structured data
    if (profile.education || profile.skills || profile.age) {
      let bioData = {};
      if (profile.education) bioData.education = profile.education;
      if (profile.skills) bioData.skills = profile.skills;
      if (profile.age) bioData.age = profile.age;
      
      updateFields.push('bio = ?');
      updateValues.push(JSON.stringify(bioData));
    }
    
    if (profile.location !== undefined && profile.location !== null) {
      updateFields.push('location = ?');
      updateValues.push(profile.location || null);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid profile fields to update' });
    }
    
    updateValues.push(userId);
    
    const [result] = await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
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
