const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password required' });
    }
    const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (username, email, password_hash, role, account_status, email_verified) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashed, role || 'user', 'active', 1]
    );
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const [result] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = result[0];
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    if (!user.password_hash) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(400).json({ error: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const [result] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = result[0];

    if (!user) {
      // For security, we don't reveal if the email exists or not
      return res.json({ message: 'If this email exists in our system, password reset instructions have been sent.' });
    }

    // Generate a password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user.id, type: 'password_reset' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // In a real application, you would:
    // 1. Store the reset token in the database with expiration
    // 2. Send an email with the reset link
    // 3. The reset link would be: http://yoursite.com/reset-password?token=resetToken

    // For development purposes, we'll just log the reset token
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset URL would be: http://localhost:3003/reset-password?token=${resetToken}`);

    // TODO: Implement email sending service (like SendGrid, Nodemailer, etc.)
    // await sendPasswordResetEmail(email, resetToken);

    res.json({ 
      message: 'If this email exists in our system, password reset instructions have been sent.',
      // For development only - remove in production
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });

  } catch (err) {
    console.error('FORGOT PASSWORD ERROR:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, decoded.id]
    );

    res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });

  } catch (err) {
    console.error('RESET PASSWORD ERROR:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;
