const express = require('express');
const { getPool } = require('../db');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Setup database tables and admin user (for production deployment)
router.post('/setup-database', async (req, res) => {
  try {
    // Check if tables already exist
    const [tables] = await pool.execute("SHOW TABLES LIKE 'users'");
    
    if (tables.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Database already initialized',
        tables: 'Users table exists'
      });
    }

    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role ENUM('user', 'admin', 'employer') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create other essential tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        salary_range VARCHAR(100),
        job_type ENUM('full-time', 'part-time', 'contract', 'internship') DEFAULT 'full-time',
        employer_id INT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employer_id) REFERENCES users(id)
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await pool.execute(
      'INSERT IGNORE INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      ['admin@startwise.com', hashedPassword, 'Admin', 'User', 'admin']
    );

    res.json({ 
      success: true, 
      message: 'Database initialized successfully',
      tables: ['users', 'jobs', 'applications'],
      adminUser: 'admin@startwise.com'
    });

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database setup failed',
      details: error.message 
    });
  }
});

// Health check for database connection
router.get('/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ 
      success: true, 
      message: 'Database connection healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

module.exports = router;