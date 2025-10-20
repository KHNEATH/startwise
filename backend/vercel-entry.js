// Vercel serverless entry - require the app and export it.
// If requiring the app fails at deploy-time, export a handler that returns a
// useful JSON error so Vercel logs are clearer and the frontend can see an error.
let appHandler;
try {
	// require the app (server.js now exports the Express app)
	const app = require('./server');
	// Express app is a valid request handler for serverless platforms
	appHandler = app;
} catch (err) {
	// If the require failed, create a fallback handler
	console.error('Failed to initialize backend app in vercel-entry:', err && err.stack ? err.stack : err);
	appHandler = (req, res) => {
		res.statusCode = 500;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ error: 'Backend initialization error', detail: err?.message || String(err) }));
	};
}

module.exports = appHandler;
