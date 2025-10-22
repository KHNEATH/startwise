const express = require('express');
const { getPool } = require('../db');
const router = express.Router();

// Get all applications (for admin/employer view)
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    const [applications] = await pool.execute(`
      SELECT a.*, j.title as job_title, j.company 
      FROM applications a 
      LEFT JOIN jobs j ON a.job_id = j.id 
      ORDER BY a.created_at DESC
    `);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create regular application
router.post('/', async (req, res) => {
  try {
    const { job_id, user_id, message } = req.body;
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    // Check if user already applied to this job
    const [existing] = await pool.execute(
      'SELECT id FROM applications WHERE job_id = ? AND user_id = ?',
      [job_id, user_id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO applications (job_id, user_id, message, status) VALUES (?, ?, ?, ?)',
      [job_id, user_id, message || '', 'pending']
    );
    
    const [newApplication] = await pool.execute(
      'SELECT a.*, j.title as job_title, j.company FROM applications a LEFT JOIN jobs j ON a.job_id = j.id WHERE a.id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newApplication[0]);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Quick apply (no CV required)
router.post('/quick', async (req, res) => {
  try {
    const { job_title, company, user_id, name, email } = req.body;
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    
    const [result] = await pool.execute(
      'INSERT INTO applications (job_title, company, user_id, applicant_name, applicant_email, application_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [job_title, company, user_id, name, email, 'quick', 'pending']
    );
    
    const [newApplication] = await pool.execute(
      'SELECT * FROM applications WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newApplication[0]);
  } catch (error) {
    console.error('Error creating quick application:', error);
    res.status(500).json({ error: 'Failed to submit quick application' });
  }
});

// Get applications by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [applications] = await pool.execute(`
      SELECT a.*, j.title as job_title, j.company 
      FROM applications a 
      LEFT JOIN jobs j ON a.job_id = j.id 
      WHERE a.user_id = ? 
      ORDER BY a.created_at DESC
    `, [userId]);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

module.exports = router;
