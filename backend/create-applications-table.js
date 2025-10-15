const pool = require('./db');

(async () => {
  try {
    console.log('Creating applications table...');
    
    // Create applications table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NULL,
        user_id INT NOT NULL,
        job_title VARCHAR(255) NULL,
        company VARCHAR(255) NULL,
        applicant_name VARCHAR(255) NULL,
        applicant_email VARCHAR(255) NULL,
        message TEXT,
        application_type ENUM('regular', 'quick') DEFAULT 'regular',
        status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_job_id (job_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `);
    
    console.log('Applications table created successfully!');
    
    // Show the table structure
    const [columns] = await pool.execute('DESCRIBE applications');
    console.log('Applications table structure:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating applications table:', err.message);
    process.exit(1);
  }
})();