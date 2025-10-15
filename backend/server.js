
const express = require('express');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
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

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
