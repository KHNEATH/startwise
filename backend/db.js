
const mysql = require('mysql2/promise');
const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let pool = null;

const createPool = () => {
  if (pool) return pool;

  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    // Do not throw here - throw when routes attempt to use DB so app can start
    console.warn('Database credentials are missing. DB connections will fail until configured.');
    return null;
  }

  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
};

module.exports = {
  getPool: () => {
    if (!pool) return createPool();
    return pool;
  }
};
