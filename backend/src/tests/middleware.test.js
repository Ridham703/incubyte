const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../middleware/auth.middleware');
const { errorHandler } = require('../middleware/errorHandler');

const testApp = express();
testApp.use(express.json());

// Dummy protected route
testApp.get('/test/protected', protect, (req, res) => {
  res.status(200).json({ status: 'success', user: req.user });
});

// Dummy admin-only route
testApp.get('/test/admin', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ status: 'success', message: 'Admin access granted', user: req.user });
});

testApp.use(errorHandler);

describe('Authentication & Authorization Middleware', () => {
  const secret = 'test_secret_key';

  beforeEach(() => {
    process.env.JWT_SECRET = secret;
  });

  describe('protect (JWT Authentication Middleware)', () => {
    it('should allow access and attach user payload when valid Bearer token is provided', async () => {
      const token = jwt.sign({ id: 'user123', role: 'user' }, secret);

      const response = await request(testApp)
        .get('/test/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.user).toEqual({ id: 'user123', role: 'user', iat: expect.any(Number) });
    });

    it('should return 401 Unauthorized if Authorization header is missing', async () => {
      const response = await request(testApp).get('/test/protected');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/no token provided/i);
    });

    it('should return 401 Unauthorized if token is malformed or invalid', async () => {
      const response = await request(testApp)
        .get('/test/protected')
        .set('Authorization', 'Bearer invalid_token_string');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid or expired token/i);
    });
  });

  describe('authorize (Role-Based Authorization Middleware)', () => {
    it('should allow access to admin-only route for user with admin role', async () => {
      const adminToken = jwt.sign({ id: 'admin123', role: 'admin' }, secret);

      const response = await request(testApp)
        .get('/test/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin access granted');
      expect(response.body.user.role).toBe('admin');
    });

    it('should return 403 Forbidden when a user with non-admin role attempts access', async () => {
      const userToken = jwt.sign({ id: 'user123', role: 'user' }, secret);

      const response = await request(testApp)
        .get('/test/admin')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/access denied: admin privileges required/i);
    });

    it('should return 401 Unauthorized when unauthenticated user requests admin route', async () => {
      const response = await request(testApp).get('/test/admin');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/no token provided/i);
    });
  });
});
