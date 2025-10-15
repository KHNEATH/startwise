const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to log user activity
async function logUserActivity(userId, actionType, description, req, success = true) {
  try {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    await pool.execute(`
      INSERT INTO user_activity_logs (user_id, action_type, action_description, ip_address, user_agent, success)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userId, actionType, description, ip, userAgent, success]);
  } catch (error) {
    console.error('Failed to log user activity:', error);
  }
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, role = 'user' } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this email or username already exists' 
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Get client IP
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Create user
    const [result] = await pool.execute(`
      INSERT INTO users (
        username, email, password_hash, first_name, last_name, phone, 
        role, account_status, created_by_ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `, [username, email, hashedPassword, firstName, lastName, phone, role, clientIP]);
    
    const userId = result.insertId;
    
    // Log registration activity
    await logUserActivity(userId, 'register', 'User registered successfully', req);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId, username, email, role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId,
        username,
        email,
        firstName,
        lastName,
        role,
        token
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during registration' 
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      await logUserActivity(null, 'failed_login', `Failed login attempt for email: ${email} - User not found`, req, false);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    const user = users[0];
    
    // Check account status
    if (user.account_status === 'blocked' || user.account_status === 'suspended') {
      await logUserActivity(user.id, 'failed_login', `Login attempt on ${user.account_status} account`, req, false);
      return res.status(403).json({ 
        success: false, 
        message: `Account is ${user.account_status}. Please contact support.` 
      });
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordValid) {
      // Update failed login attempts
      await pool.execute(
        'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?',
        [user.id]
      );
      
      await logUserActivity(user.id, 'failed_login', 'Failed login attempt - incorrect password', req, false);
      
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Get client IP
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Update login info
    await pool.execute(`
      UPDATE users SET 
        login_count = login_count + 1,
        failed_login_attempts = 0,
        last_login_at = NOW(),
        last_login_ip = ?
      WHERE id = ?
    `, [clientIP, user.id]);
    
    // Log successful login
    await logUserActivity(user.id, 'login', 'User logged in successfully', req);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        token
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during login' 
    });
  }
});

// Get all users (Admin only)
router.get('/all', async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT 
        id, username, email, first_name, last_name, phone, role, 
        account_status, email_verified, login_count, failed_login_attempts,
        created_at, updated_at, last_login_at, created_by_ip, last_login_ip
      FROM users 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: users
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get user activity logs (Admin only)
router.get('/activity-logs', async (req, res) => {
  try {
    const { userId, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        ual.id, ual.user_id, ual.action_type, ual.action_description,
        ual.ip_address, ual.user_agent, ual.success, ual.created_at,
        u.username, u.email, u.first_name, u.last_name
      FROM user_activity_logs ual
      LEFT JOIN users u ON ual.user_id = u.id
    `;
    
    let params = [];
    
    if (userId) {
      query += ' WHERE ual.user_id = ?';
      params.push(userId);
    }
    
    query += ' ORDER BY ual.created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const [logs] = await pool.execute(query, params);
    
    res.json({
      success: true,
      data: logs
    });
    
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update user status (Admin only)
router.patch('/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['active', 'suspended', 'pending', 'blocked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    await pool.execute(
      'UPDATE users SET account_status = ?, updated_at = NOW() WHERE id = ?',
      [status, userId]
    );
    
    // Log the admin action
    await logUserActivity(userId, 'status_change', `Account status changed to ${status} by admin`, req);
    
    res.json({
      success: true,
      message: `User status updated to ${status}`
    });
    
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get user statistics for admin dashboard
router.get('/stats', async (req, res) => {
  try {
    // Get user counts by role
    const [roleCounts] = await pool.execute(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    
    // Get user counts by status
    const [statusCounts] = await pool.execute(`
      SELECT account_status, COUNT(*) as count 
      FROM users 
      GROUP BY account_status
    `);
    
    // Get recent registrations (last 30 days)
    const [recentRegistrations] = await pool.execute(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    // Get login activity (last 7 days)
    const [loginActivity] = await pool.execute(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM user_activity_logs 
      WHERE action_type = 'login' 
      AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    // Get total counts
    const [totals] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN account_status = 'active' THEN 1 END) as active_users,
        COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_month
      FROM users
    `);
    
    res.json({
      success: true,
      data: {
        totals: totals[0],
        roleDistribution: roleCounts,
        statusDistribution: statusCounts,
        recentRegistrations,
        loginActivity
      }
    });
    
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;