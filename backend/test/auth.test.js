// Basic backend auth API tests using Jest and supertest
const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  it('should reject registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: '' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject login with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: '' });
    expect(res.statusCode).toBe(400);
  });
});
