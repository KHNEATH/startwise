// Vercel serverless entry - export the Express app as a request handler
// This file simply requires the app exported by server.js and re-exports it
const app = require('./server');

// Express app is a valid request handler for serverless platforms
module.exports = app;
