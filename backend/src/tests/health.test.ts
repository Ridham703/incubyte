import request from 'supertest';
import app from '../app';

describe('GET /api/health', () => {
  it('should return 200 OK and server status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'UP',
      message: 'Car Dealership Inventory API is running',
      timestamp: expect.any(String),
    });
  });

  it('should return 404 Not Found for unhandled API endpoints', async () => {
    const response = await request(app).get('/api/nonexistent-route');

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('error');
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toContain('Cannot find /api/nonexistent-route');
  });
});
