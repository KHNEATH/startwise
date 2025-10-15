const pool = require('./config/db');

async function addProfileJsonColumn() {
  try {
    // Check if column exists
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'startwise_db' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'profile_json'
    `);
    
    if (columns.length === 0) {
      // Column doesn't exist, add it
      await pool.query('ALTER TABLE users ADD COLUMN profile_json JSON');
      console.log('✅ Added profile_json column to users table');
    } else {
      console.log('✅ profile_json column already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

addProfileJsonColumn();