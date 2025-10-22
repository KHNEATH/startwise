const express = require('express');
const { getPool } = require('../db');
const router = express.Router();

// Demo jobs for when database is not available
const getDemoJobsForAPI = () => {
  return [
    {
      id: 'demo-1',
      title: 'Frontend Developer',
      company: 'Tech Startup Cambodia',
      location: 'Phnom Penh, Cambodia',
      type: 'Full-time',
      description: 'Join our team to build amazing web applications using React and modern technologies. Perfect for developers looking to grow their skills in a startup environment.',
      created_at: new Date().toISOString(),
      employer_id: 1
    },
    {
      id: 'demo-2',
      title: 'Part-time English Tutor',
      company: 'Education Center',
      location: 'Siem Reap, Cambodia',
      type: 'Part-time',
      description: 'Teach English to local students. No experience required, training provided. Perfect for students or recent graduates.',
      created_at: new Date().toISOString(),
      employer_id: 1
    },
    {
      id: 'demo-3',
      title: 'Social Media Assistant',
      company: 'Digital Agency Cambodia',
      location: 'Remote',
      type: 'Internship',
      description: 'Help manage social media accounts for various clients. Learn digital marketing skills while earning money.',
      created_at: new Date().toISOString(),
      employer_id: 1
    },
    {
      id: 'demo-4',
      title: 'Data Entry Clerk',
      company: 'StartWise Solutions',
      location: 'Phnom Penh, Cambodia',
      type: 'Part-time',
      description: 'Perfect for students! Flexible hours, competitive pay. Help us organize and input data while learning valuable office skills.',
      created_at: new Date().toISOString(),
      employer_id: 1
    }
  ];
};

// Post a new job - specific route
router.post('/post', async (req, res) => {
  const { title, company, location, description, type, employer_id } = req.body;
  
  // Validation
  if (!title || !company || !location || !description) {
    return res.status(400).json({ error: 'All fields (title, company, location, description) are required' });
  }
  
  try {
    const pool = getPool();
    
    // If database is available, use it
    if (pool) {
      try {
        const [result] = await pool.execute(
          'INSERT INTO jobs (title, description, company, location, type, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
          [title, description, company, location, type || 'Full-time', employer_id || 1]
        );
        const [job] = await pool.execute(
          'SELECT * FROM jobs WHERE id = ?',
          [result.insertId]
        );
        console.log('✅ Job posted to database:', job[0]);
        return res.status(201).json({
          success: true,
          message: 'Job posted successfully',
          job: job[0]
        });
      } catch (dbError) {
        console.error('❌ Database error, falling back to demo mode:', dbError.message);
        // Fall through to demo mode
      }
    }
    
    // Fallback for production/demo mode when database is not available
    console.log('🎭 Using demo mode for job posting');
    const demoJob = {
      id: `demo-job-${Date.now()}`,
      title,
      description,
      company,
      location,
      type: type || 'Full-time',
      employer_id: employer_id || 1,
      created_at: new Date().toISOString(),
      status: 'active'
    };
    
    // Simulate slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 300));
    
    res.status(201).json({
      success: true,
      message: 'Job posted successfully (demo mode)',
      job: demoJob,
      demo: true
    });
    
  } catch (err) {
    console.error('❌ Job posting error:', err);
    res.status(500).json({ 
      error: 'Failed to post job', 
      details: err.message 
    });
  }
});

// Post a new job - fallback route
router.post('/', async (req, res) => {
  const { title, company, location, description, type, employer_id } = req.body;
  
  // Validation
  if (!title || !company || !location || !description) {
    return res.status(400).json({ error: 'All fields (title, company, location, description) are required' });
  }
  
  try {
    const pool = getPool();
    
    // If database is available, use it
    if (pool) {
      try {
        const [result] = await pool.execute(
          'INSERT INTO jobs (title, description, company, location, type, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
          [title, description, company, location, type || 'Full-time', employer_id || 1]
        );
        const [job] = await pool.execute(
          'SELECT * FROM jobs WHERE id = ?',
          [result.insertId]
        );
        console.log('✅ Job posted to database:', job[0]);
        return res.status(201).json({
          success: true,
          message: 'Job posted successfully',
          job: job[0]
        });
      } catch (dbError) {
        console.error('❌ Database error, falling back to demo mode:', dbError.message);
        // Fall through to demo mode
      }
    }
    
    // Fallback for production/demo mode when database is not available
    console.log('🎭 Using demo mode for job posting');
    const demoJob = {
      id: `demo-job-${Date.now()}`,
      title,
      description,
      company,
      location,
      type: type || 'Full-time',
      employer_id: employer_id || 1,
      created_at: new Date().toISOString(),
      status: 'active'
    };
    
    // Simulate slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 300));
    
    res.status(201).json({
      success: true,
      message: 'Job posted successfully (demo mode)',
      job: demoJob,
      demo: true
    });
    
  } catch (err) {
    console.error('❌ Job posting error:', err);
    res.status(500).json({ 
      error: 'Failed to post job', 
      details: err.message 
    });
  }
});

// Browse jobs with optional filters - specific route to avoid conflict
router.get('/browse', async (req, res) => {
  const { title, company, location, type } = req.query;
  
  try {
    const pool = getPool();
    
    // If database is available, use it
    if (pool) {
      try {
        let query = 'SELECT * FROM jobs WHERE 1=1';
        const params = [];
        
        if (title) {
          query += ' AND title LIKE ?';
          params.push(`%${title}%`);
        }
        if (company) {
          query += ' AND company LIKE ?';
          params.push(`%${company}%`);
        }
        if (location) {
          query += ' AND location LIKE ?';
          params.push(`%${location}%`);
        }
        if (type) {
          query += ' AND type LIKE ?';
          params.push(`%${type}%`);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [jobs] = await pool.execute(query, params);
        console.log('✅ Jobs fetched from database:', jobs.length);
        return res.json(jobs);
      } catch (dbError) {
        console.error('❌ Database error, falling back to demo mode:', dbError.message);
        // Fall through to demo mode
      }
    }
    
    // Fallback for production/demo mode when database is not available
    console.log('🎭 Using demo mode for job browsing');
    const demoJobs = getDemoJobsForAPI();
    
    // Apply basic filtering
    const filteredJobs = demoJobs.filter(job => {
      if (title && !job.title.toLowerCase().includes(title.toLowerCase())) return false;
      if (company && !job.company.toLowerCase().includes(company.toLowerCase())) return false;
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (type && job.type !== type) return false;
      return true;
    });
    
    console.log('📊 Demo jobs returned:', filteredJobs.length);
    res.json(filteredJobs);
    
  } catch (err) {
    console.error('❌ Job browsing error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch jobs', 
      details: err.message 
    });
  }
});

// Browse jobs with optional filters - fallback route
router.get('/', async (req, res) => {
  const { title, company, location, type } = req.query;
  
  try {
    const pool = getPool();
    
    // If database is available, use it
    if (pool) {
      try {
        let query = 'SELECT * FROM jobs WHERE 1=1';
        const params = [];
        
        if (title) {
          query += ' AND title LIKE ?';
          params.push(`%${title}%`);
        }
        if (company) {
          query += ' AND company LIKE ?';
          params.push(`%${company}%`);
        }
        if (location) {
          query += ' AND location LIKE ?';
          params.push(`%${location}%`);
        }
        if (type) {
          query += ' AND type LIKE ?';
          params.push(`%${type}%`);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [jobs] = await pool.execute(query, params);
        console.log('✅ Jobs fetched from database (fallback route):', jobs.length);
        return res.json(jobs);
      } catch (dbError) {
        console.error('❌ Database error in fallback route, using demo mode:', dbError.message);
        // Fall through to demo mode
      }
    }
    
    // Fallback for production/demo mode when database is not available
    console.log('🎭 Using demo mode for job browsing (fallback route)');
    const demoJobs = getDemoJobsForAPI();
    
    // Apply basic filtering
    const filteredJobs = demoJobs.filter(job => {
      if (title && !job.title.toLowerCase().includes(title.toLowerCase())) return false;
      if (company && !job.company.toLowerCase().includes(company.toLowerCase())) return false;
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (type && job.type !== type) return false;
      return true;
    });
    
    console.log('📊 Demo jobs returned (fallback route):', filteredJobs.length);
    res.json(filteredJobs);
    
  } catch (err) {
    console.error('❌ Job browsing error (fallback route):', err);
    res.status(500).json({ 
      error: 'Failed to fetch jobs', 
      details: err.message 
    });
  }
});

// Update job by ID
router.put('/:id', async (req, res) => {
  const { title, company, location, description, type } = req.body;
  if (!title || !company || !location || !description) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  try {
    const [result] = await pool.execute(
      'UPDATE jobs SET title = ?, description = ?, company = ?, location = ?, type = ? WHERE id = ?',
      [title, description, company, location, type || 'Full-time', req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const [updatedJob] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    res.json(updatedJob[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete job by ID
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get job by ID - moved after specific routes to avoid conflicts
router.get('/:id', async (req, res) => {
  try {
    const [jobs] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(jobs[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update job by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, company, location, description, type } = req.body;
  
  if (!title || !company || !location || !description) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  try {
    const [result] = await pool.execute(
      'UPDATE jobs SET title = ?, description = ?, company = ?, location = ?, type = ? WHERE id = ?',
      [title, description, company, location, type || 'Full-time', id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const [updatedJob] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [id]);
    res.json(updatedJob[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete job by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.execute('DELETE FROM jobs WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully', id: parseInt(id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;