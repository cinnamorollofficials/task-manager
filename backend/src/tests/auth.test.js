import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

describe('Auth API Endpoints', () => {
  const testEmail = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
  const testPassword = 'testpassword123';
  const testName = 'Test User';

  // Clean up database records and close pool connection
  afterAll(async () => {
    try {
      await pool.query('DELETE FROM users WHERE email = ?', [testEmail]);
    } catch (err) {
      console.error('Error during cleanup:', err);
    } finally {
      await pool.end();
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: testName,
          email: testEmail,
          password: testPassword
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.userId).toBeTypeOf('number');
    });

    it('should return 400 if validation fails (missing email)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: testName,
          password: testPassword
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('required');
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: testName,
          email: 'another@example.com',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('at least 6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.token).toBeTypeOf('string');
      expect(res.body.user).toEqual({
        id: expect.any(Number),
        name: testName,
        email: testEmail
      });
    });

    it('should fail to login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid email or password');
    });
  });
});
