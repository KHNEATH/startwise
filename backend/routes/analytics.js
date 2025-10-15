const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get profile count
router.get('/analytics/profile/count', async (req, res) => {
  try {
    // Since we don't have a profiles table, we'll use a mock count or use users table
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM users');
    res.json({ count: result[0].count });
  } catch (err) {
    console.error('Error fetching profile count:', err);
    res.json({ count: 0 }); // Return 0 if table doesn't exist
  }
});

// Get CV count
router.get('/analytics/cv/count', async (req, res) => {
  try {
    // Mock CV count since we might not have a CVs table
    res.json({ count: 25 });
  } catch (err) {
    console.error('Error fetching CV count:', err);
    res.json({ count: 0 });
  }
});

// Get jobs count
router.get('/analytics/jobs/count', async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM jobs');
    res.json({ count: result[0].count });
  } catch (err) {
    console.error('Error fetching jobs count:', err);
    res.json({ count: 0 });
  }
});

// Get mentors count
router.get('/analytics/mentors/count', async (req, res) => {
  try {
    // Mock mentors count
    res.json({ count: 8 });
  } catch (err) {
    console.error('Error fetching mentors count:', err);
    res.json({ count: 0 });
  }
});

// Get employers count
router.get('/analytics/employers/count', async (req, res) => {
  try {
    // Mock employers count
    res.json({ count: 12 });
  } catch (err) {
    console.error('Error fetching employers count:', err);
    res.json({ count: 0 });
  }
});

// Get comprehensive analytics
router.get('/dashboard', async (req, res) => {
  try {
    // Get real job statistics
    const [jobsCount] = await pool.execute('SELECT COUNT(*) as count FROM jobs');
    const [applicationsCount] = await pool.execute('SELECT COUNT(*) as count FROM applications');
    const [testimonialsCount] = await pool.execute('SELECT COUNT(*) as count FROM testimonials');
    
    // Job type breakdown
    const [jobTypes] = await pool.execute(`
      SELECT type, COUNT(*) as count 
      FROM jobs 
      GROUP BY type 
      ORDER BY count DESC
    `);
    
    // Recent applications
    const [recentApps] = await pool.execute(`
      SELECT job_title, company, applicant_name, created_at
      FROM applications 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    const analytics = {
      totals: {
        jobs: jobsCount[0].count,
        applications: applicationsCount[0].count,
        testimonials: testimonialsCount[0].count,
        users: 45, // Mock data
        cvs: 32    // Mock data
      },
      jobTypes: jobTypes,
      recentApplications: recentApps
    };
    
    res.json(analytics);
  } catch (err) {
    console.error('Error fetching dashboard analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;