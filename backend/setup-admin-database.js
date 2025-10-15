const mysql = require('mysql2/promise');
require('dotenv').config();

const createAdminDatabase = async () => {
  console.log('🚀 Creating comprehensive admin database structure...');
  
  // Create connection without database first
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  });

  try {
    // Create database if not exists
    console.log('📁 Creating database...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'startwise_db'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'startwise_db'}`);
    console.log('✅ Database created/selected');

    // Create Users table with comprehensive admin tracking
    console.log('👥 Creating users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        phone VARCHAR(20),
        profile_picture VARCHAR(255),
        bio TEXT,
        location VARCHAR(100),
        role ENUM('user', 'employer', 'admin') DEFAULT 'user',
        account_status ENUM('active', 'suspended', 'pending', 'blocked') DEFAULT 'active',
        email_verified BOOLEAN DEFAULT FALSE,
        last_login_at TIMESTAMP NULL,
        login_count INT DEFAULT 0,
        failed_login_attempts INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by_ip VARCHAR(45),
        last_login_ip VARCHAR(45),
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_status (account_status),
        INDEX idx_created_at (created_at)
      )
    `);

    // Create Jobs table
    console.log('💼 Creating jobs table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        company VARCHAR(255),
        location VARCHAR(255),
        type ENUM('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship') DEFAULT 'Full-time',
        salary_min DECIMAL(10,2),
        salary_max DECIMAL(10,2),
        currency VARCHAR(3) DEFAULT 'USD',
        requirements TEXT,
        benefits TEXT,
        employer_id INT,
        status ENUM('active', 'inactive', 'filled', 'expired') DEFAULT 'active',
        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL,
        views_count INT DEFAULT 0,
        applications_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_location (location),
        INDEX idx_type (type),
        INDEX idx_posted_at (posted_at)
      )
    `);

    // Create Applications table
    console.log('📋 Creating applications table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT,
        user_id INT NOT NULL,
        job_title VARCHAR(255),
        company VARCHAR(255),
        applicant_name VARCHAR(255),
        applicant_email VARCHAR(255),
        resume_path VARCHAR(255),
        cover_letter TEXT,
        message TEXT,
        application_type ENUM('regular', 'quick') DEFAULT 'regular',
        status ENUM('pending', 'reviewed', 'interview', 'accepted', 'rejected') DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP NULL,
        reviewed_by INT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_job_id (job_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_applied_at (applied_at)
      )
    `);

    // Create Testimonials table
    console.log('⭐ Creating testimonials table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255),
        company VARCHAR(255),
        content TEXT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        approved_by INT NULL,
        approved_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_rating (rating),
        INDEX idx_featured (featured)
      )
    `);

    // Create Admin Activity Log table
    console.log('📊 Creating admin activity log...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        action VARCHAR(100) NOT NULL,
        target_type ENUM('user', 'job', 'application', 'testimonial', 'system') NOT NULL,
        target_id INT NULL,
        details JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_admin_id (admin_id),
        INDEX idx_action (action),
        INDEX idx_target_type (target_type),
        INDEX idx_created_at (created_at)
      )
    `);

    // Create System Settings table
    console.log('⚙️ Creating system settings...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
        description TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        updated_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_setting_key (setting_key),
        INDEX idx_is_public (is_public)
      )
    `);

    // Create Analytics table
    console.log('📈 Creating analytics table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(15,2) NOT NULL,
        metric_type ENUM('counter', 'gauge', 'histogram') DEFAULT 'counter',
        dimensions JSON,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_metric_name (metric_name),
        INDEX idx_recorded_at (recorded_at)
      )
    `);

    console.log('✅ All tables created successfully!');
    
    // Insert default admin user if not exists
    console.log('👨‍💼 Creating default admin user...');
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await connection.execute(`
      INSERT IGNORE INTO users 
      (username, email, password_hash, first_name, last_name, role, account_status, email_verified, created_by_ip) 
      VALUES 
      ('admin', 'admin@startwise.com', ?, 'Admin', 'User', 'admin', 'active', TRUE, '127.0.0.1')
    `, [adminPassword]);

    // Insert default system settings
    console.log('⚙️ Adding default system settings...');
    const defaultSettings = [
      ['site_name', 'StartWise', 'string', 'Website name', true],
      ['site_description', 'Professional Career Platform', 'string', 'Website description', true],
      ['max_login_attempts', '5', 'number', 'Maximum failed login attempts before account lock', false],
      ['session_timeout', '24', 'number', 'Session timeout in hours', false],
      ['allow_registration', 'true', 'boolean', 'Allow new user registration', false],
      ['maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false]
    ];

    for (const [key, value, type, desc, isPublic] of defaultSettings) {
      await connection.execute(`
        INSERT IGNORE INTO system_settings 
        (setting_key, setting_value, setting_type, description, is_public) 
        VALUES (?, ?, ?, ?, ?)
      `, [key, value, type, desc, isPublic]);
    }

    // Show database statistics
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('========================');
    
    const tables = ['users', 'jobs', 'applications', 'testimonials', 'admin_activity_log', 'system_settings', 'analytics'];
    for (const table of tables) {
      const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`${table.toUpperCase().padEnd(20)}: ${result[0].count} records`);
    }

    // Show admin user details
    const [adminUsers] = await connection.execute(`
      SELECT id, username, email, role, account_status, created_at 
      FROM users WHERE role = 'admin'
    `);
    
    console.log('\n👨‍💼 ADMIN USERS:');
    console.log('================');
    adminUsers.forEach(admin => {
      console.log(`ID: ${admin.id} | Email: ${admin.email} | Status: ${admin.account_status}`);
    });

    console.log('\n🎉 Admin database setup completed successfully!');
    console.log('\n🔐 Admin Login Credentials:');
    console.log('Email: admin@startwise.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
};

// Run the setup
createAdminDatabase()
  .then(() => {
    console.log('\n✅ Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  });