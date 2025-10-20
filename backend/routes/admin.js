const express = require('express');
const router = express.Router();
const adminManager = require('../adminManager');
const { getPool } = require('../db');

// Middleware to check admin access
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Dashboard Stats
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const stats = await adminManager.getAdminDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/dashboard/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await adminManager.getAdminDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Management
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;
    const result = await adminManager.getAllUsers(parseInt(page), parseInt(limit), search, role);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;
    
    if (!['active', 'suspended', 'pending', 'blocked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await adminManager.updateUserStatus(userId, status, req.user.id);
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await adminManager.deleteUser(userId, req.user.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job Management
router.get('/jobs', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query;
    const result = await adminManager.getAllJobs(parseInt(page), parseInt(limit), search, status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/jobs/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const jobId = req.params.id;
    
    if (!['active', 'inactive', 'filled', 'expired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    await pool.execute('UPDATE jobs SET status = ? WHERE id = ?', [status, jobId]);
    await adminManager.logAdminActivity(req.user.id, 'update_job_status', 'job', jobId, { new_status: status });
    
    res.json({ message: 'Job status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/jobs/:id', requireAdmin, async (req, res) => {
  try {
    const jobId = req.params.id;
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    await pool.execute('DELETE FROM jobs WHERE id = ?', [jobId]);
    await adminManager.logAdminActivity(req.user.id, 'delete_job', 'job', jobId, {});
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Application Management
router.get('/applications', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const result = await adminManager.getAllApplications(parseInt(page), parseInt(limit), status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/applications/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    
    if (!['pending', 'reviewed', 'interview', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });

    await pool.execute('UPDATE applications SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?', 
      [status, req.user.id, applicationId]);
    
    await adminManager.logAdminActivity(req.user.id, 'update_application_status', 'application', applicationId, { new_status: status });
    
    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Testimonial Management
router.get('/testimonials', requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    const [testimonials] = await pool.execute(`
      SELECT t.*, u.username as user_username 
      FROM testimonials t 
      LEFT JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `);
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/testimonials/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const testimonialId = req.params.id;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });

    await pool.execute('UPDATE testimonials SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?', 
      [status, req.user.id, testimonialId]);
    
    await adminManager.logAdminActivity(req.user.id, 'update_testimonial_status', 'testimonial', testimonialId, { new_status: status });
    
    res.json({ message: 'Testimonial status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System Settings
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const settings = await adminManager.getSystemSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings/:key', requireAdmin, async (req, res) => {
  try {
    const { value } = req.body;
    const key = req.params.key;
    
    await adminManager.updateSystemSetting(key, value, req.user.id);
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activity Log
router.get('/activity', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    const [activities] = await pool.execute(`
      SELECT al.*, u.username as admin_username 
      FROM admin_activity_log al 
      JOIN users u ON al.admin_id = u.id 
      ORDER BY al.created_at DESC 
      LIMIT ? OFFSET ?
    `, [parseInt(limit), offset]);
    
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM admin_activity_log');
    
    res.json({
      activities,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics
router.get('/analytics/:metric', requireAdmin, async (req, res) => {
  try {
    const { metric } = req.params;
    const { days = 30 } = req.query;
    
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    const [data] = await pool.execute(`
      SELECT DATE(recorded_at) as date, SUM(metric_value) as value
      FROM analytics 
      WHERE metric_name = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(recorded_at)
      ORDER BY date ASC
    `, [metric, parseInt(days)]);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System Health Check
router.get('/health', requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    const [dbCheck] = await pool.execute('SELECT 1 as status');
    const [tableChecks] = await pool.execute(`
      SELECT 
        TABLE_NAME,
        TABLE_ROWS 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_TYPE = 'BASE TABLE'
    `);
    
    res.json({
      database: dbCheck[0].status === 1 ? 'healthy' : 'error',
      tables: tableChecks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;