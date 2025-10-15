const pool = require('./db');
const bcrypt = require('bcryptjs');

const populateAdminTestData = async () => {
  console.log('🔄 Populating admin test data...');

  try {
    // Add some sample users
    console.log('👥 Adding sample users...');
    const sampleUsers = [
      ['john_doe', 'john@example.com', 'John', 'Doe', 'user'],
      ['jane_smith', 'jane@example.com', 'Jane', 'Smith', 'employer'],
      ['mike_wilson', 'mike@example.com', 'Mike', 'Wilson', 'user'],
      ['sarah_johnson', 'sarah@example.com', 'Sarah', 'Johnson', 'employer'],
      ['david_brown', 'david@example.com', 'David', 'Brown', 'user']
    ];

    for (const [username, email, firstName, lastName, role] of sampleUsers) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await pool.execute(`
        INSERT IGNORE INTO users (username, email, password_hash, first_name, last_name, role, account_status, email_verified)
        VALUES (?, ?, ?, ?, ?, ?, 'active', TRUE)
      `, [username, email, hashedPassword, firstName, lastName, role]);
    }

    // Add some sample applications for existing jobs
    console.log('📋 Adding sample applications...');
    const [jobs] = await pool.execute('SELECT id, title, company FROM jobs LIMIT 10');
    const [users] = await pool.execute('SELECT id, username, email FROM users WHERE role = "user" LIMIT 5');

    const sampleApplications = [
      ['Software Engineer Position', 'TechCorp', 'I am very interested in this position...', 'pending'],
      ['Marketing Manager Role', 'MarketingPro', 'My experience in digital marketing...', 'reviewed'],
      ['Data Analyst Position', 'DataTech', 'I have strong analytical skills...', 'pending'],
      ['UI/UX Designer Role', 'DesignStudio', 'My portfolio showcases...', 'accepted'],
      ['Sales Representative', 'SalesCorp', 'I have 3 years of sales experience...', 'rejected']
    ];

    for (let i = 0; i < Math.min(sampleApplications.length, jobs.length, users.length); i++) {
      const [jobTitle, company, message, status] = sampleApplications[i];
      const job = jobs[i];
      const user = users[i % users.length];

      await pool.execute(`
        INSERT INTO applications 
        (job_id, user_id, job_title, company, applicant_name, applicant_email, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY))
      `, [job.id, user.id, job.title, job.company, user.username, user.email, message, status]);
    }

    // Add some admin activity logs
    console.log('📊 Adding admin activity logs...');
    const [adminUser] = await pool.execute('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    if (adminUser.length > 0) {
      const adminId = adminUser[0].id;
      
      const activities = [
        ['user_login', 'system', null, { ip: '192.168.1.100' }],
        ['update_user_status', 'user', 2, { new_status: 'active' }],
        ['delete_job', 'job', 5, { reason: 'inappropriate content' }],
        ['update_setting', 'system', null, { setting_key: 'maintenance_mode', new_value: 'false' }],
        ['approve_testimonial', 'testimonial', 1, { action: 'approved' }]
      ];

      for (const [action, targetType, targetId, details] of activities) {
        await pool.execute(`
          INSERT INTO admin_activity_log (admin_id, action, target_type, target_id, details, ip_address, created_at)
          VALUES (?, ?, ?, ?, ?, '127.0.0.1', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 10) DAY))
        `, [adminId, action, targetType, targetId, JSON.stringify(details)]);
      }
    }

    // Add some analytics data
    console.log('📈 Adding analytics data...');
    const metrics = ['page_views', 'user_registrations', 'job_applications', 'job_views'];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      for (const metric of metrics) {
        const value = Math.floor(Math.random() * 100) + 1;
        await pool.execute(`
          INSERT INTO analytics (metric_name, metric_value, metric_type, recorded_at)
          VALUES (?, ?, 'counter', ?)
        `, [metric, value, date]);
      }
    }

    // Show final statistics
    console.log('\n📊 FINAL DATABASE STATISTICS:');
    console.log('==============================');
    
    const tables = ['users', 'jobs', 'applications', 'testimonials', 'admin_activity_log', 'system_settings', 'analytics'];
    for (const table of tables) {
      const [result] = await pool.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`${table.toUpperCase().padEnd(20)}: ${result[0].count} records`);
    }

    console.log('\n✅ Admin test data populated successfully!');
    console.log('\n🔐 Admin Login Credentials:');
    console.log('Email: admin@startwise.com');
    console.log('Password: admin123');
    
    console.log('\n🎯 Available Admin API Endpoints:');
    console.log('================================');
    console.log('GET  /api/admin/dashboard/stats - Dashboard statistics');
    console.log('GET  /api/admin/users           - User management');
    console.log('GET  /api/admin/jobs            - Job management');
    console.log('GET  /api/admin/applications    - Application management');
    console.log('GET  /api/admin/testimonials    - Testimonial management');
    console.log('GET  /api/admin/settings        - System settings');
    console.log('GET  /api/admin/activity        - Admin activity log');
    console.log('GET  /api/admin/health          - System health check');

  } catch (error) {
    console.error('❌ Error populating test data:', error.message);
    throw error;
  }
};

// Run the population
populateAdminTestData()
  .then(() => {
    console.log('\n🎉 Database population completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database population failed:', error.message);
    process.exit(1);
  });