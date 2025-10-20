
const express = require('express');
const { getPool } = require('./db');
const cors = require('cors');
const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

// CORS configuration for production
// If FRONTEND_URL is configured use it, otherwise allow all origins temporarily
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000', 'http://localhost:3002'];

const corsOptions = {
  origin: function(origin, callback) {
    // Log origin for debugging in production
    console.log('CORS check for origin:', origin);
    if (!origin) return callback(null, true); // allow non-browser tools or same-origin
    if (process.env.FRONTEND_URL) {
      // Strict check when FRONTEND_URL is set
      return allowedOrigins.indexOf(origin) !== -1 ? callback(null, true) : callback(new Error('Not allowed by CORS'));
    }
    // When FRONTEND_URL isn't set (e.g., quick deploy), allow requests from any origin
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database connection check (non-blocking for serverless)
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    try {
      const pool = getPool();
      if (!pool) {
        console.warn('DB not configured - skipping connection check');
        return;
      }
      await pool.execute('SELECT 1');
      console.log('MySQL connected');
    } catch (err) {
      console.error('MySQL connection error:', err);
    }
  })();
}

app.get('/', (req, res) => res.json({ 
  message: 'StartWise API Running',
  version: '1.0.0',
  timestamp: new Date().toISOString()
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/media', require('./routes/media'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/cv', require('./routes/cv'));
app.use('/api/setup', require('./routes/setup'));
app.use('/api', require('./routes/analytics'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler - use a proper path pattern
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

// If this module is run directly (node server.js), start the listener for local dev
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

// Export app for serverless platforms (Vercel) or testing
module.exports = app;
