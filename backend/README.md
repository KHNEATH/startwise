# StartWise Backend

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file (see `.env.example` for required variables).
3. Ensure PostgreSQL is running and the database is created (see `models/schema.sql`).
4. Start the backend server:
   ```
   node src/index.js
   ```

## Testing

Run backend tests with:
```
npm test
```

## API Endpoints
- `/api/auth/register` - Register a new user
- `/api/auth/login` - Login and receive JWT
- `/api/profile` - User profile management
- `/api/jobs` - Job board endpoints
- `/api/cv` - CV management

## Tech Stack
- Node.js, Express, PostgreSQL, JWT, Socket.io

---

For full-stack setup, see the main project README.
