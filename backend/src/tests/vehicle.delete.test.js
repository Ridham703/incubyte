const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const { vehicleRepository } = require('../repositories/vehicle.repository');

jest.mock('../repositories/vehicle.repository');

describe('DELETE /api/vehicles/:id (Soft Delete Vehicle API - Admin Only)', () => {
  const secret = 'test_secret_key';
  const adminToken = jwt.sign({ id: 'admin123', role: 'admin' }, secret);
  const userToken = jwt.sign({ id: 'user123', role: 'user' }, secret);
  const vehicleId = '607f1f77bcf86cd799439011';

  const existingVehicle = {
    _id: vehicleId,
    make: 'Ford',
    model: 'Mustang',
    year: 2023,
    price: 45000,
    mileage: 3000,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    stock: 1,
    isDeleted: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = secret;
  });

  it('should allow an admin to soft delete a vehicle successfully (200 OK)', async () => {
    vehicleRepository.findById.mockResolvedValue(existingVehicle);
    vehicleRepository.softDelete.mockResolvedValue({
      ...existingVehicle,
      isDeleted: true,
      deletedAt: new Date(),
    });

    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toMatch(/deleted successfully/i);
    expect(response.body.data.id).toBe(vehicleId);
  });

  it('should return 404 Not Found if vehicle does not exist or is already soft-deleted', async () => {
    vehicleRepository.findById.mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/vehicle not found/i);
  });

  it('should return 403 Forbidden when a non-admin user attempts to delete a vehicle', async () => {
    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/access denied: admin privileges required/i);
  });

  it('should return 401 Unauthorized if no Authorization header is provided', async () => {
    const response = await request(app).delete(`/api/vehicles/${vehicleId}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/no token provided/i);
  });
});
