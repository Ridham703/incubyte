import request from 'supertest';
import app from '../app';
import { userRepository } from '../repositories/user.repository';
import { authService } from '../services/auth.service';
import jwt from 'jsonwebtoken';

jest.mock('../repositories/user.repository');

describe('Authentication API Endpoint (/api/auth)', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$hashedpasswordstringexample',
    role: 'user' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret_key';
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return JWT token', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toEqual({
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 409 Conflict if email is already registered', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/already exists/i);
    });

    it('should return 400 Bad Request if validation fails (e.g. invalid email or short password)', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John',
        email: 'not-an-email',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials and return JWT token', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(authService, 'comparePassword').mockResolvedValue(true as never);

      const response = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('john@example.com');
    });

    it('should return 401 Unauthorized for non-existent user email', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid credentials/i);
    });

    it('should return 401 Unauthorized for incorrect password', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(authService, 'comparePassword').mockResolvedValue(false as never);

      const response = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid credentials/i);
    });
  });

  describe('GET /api/auth/me (Protected Route)', () => {
    it('should return current user profile when valid Bearer token is provided', async () => {
      const token = jwt.sign({ id: mockUser._id, role: mockUser.role }, 'test_secret_key');
      (userRepository.findById as jest.Mock).mockResolvedValue({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe('john@example.com');
    });

    it('should return 401 Unauthorized if no Authorization token header is sent', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/no token provided/i);
    });
  });
});
