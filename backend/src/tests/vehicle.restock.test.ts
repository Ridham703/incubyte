import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { vehicleRepository } from '../repositories/vehicle.repository';

jest.mock('../repositories/vehicle.repository');

describe('POST /api/vehicles/:id/restock (Restock Vehicle API Endpoint - Admin Only)', () => {
  const secret = 'test_secret_key';
  const adminToken = jwt.sign({ id: 'admin123', role: 'admin' }, secret);
  const userToken = jwt.sign({ id: 'user123', role: 'user' }, secret);
  const vehicleId = '607f1f77bcf86cd799439011';

  const existingVehicle = {
    _id: vehicleId,
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 24000,
    mileage: 5000,
    fuelType: 'Gasoline',
    transmission: 'CVT',
    stock: 3,
    isDeleted: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = secret;
  });

  it('should allow an admin to restock a vehicle and increment inventory (200 OK)', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(existingVehicle);
    (vehicleRepository.incrementStock as jest.Mock).mockResolvedValue({
      ...existingVehicle,
      stock: 8,
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toMatch(/restocked successfully/i);
    expect(response.body.data.addedQuantity).toBe(5);
    expect(response.body.data.newStock).toBe(8);
  });

  it('should return 400 Bad Request if restock quantity is less than 1', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 0 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/restock quantity must be at least 1/i);
  });

  it('should return 404 Not Found if vehicle does not exist', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/vehicle not found/i);
  });

  it('should return 403 Forbidden when a non-admin user attempts to restock a vehicle', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/access denied: admin privileges required/i);
  });

  it('should return 401 Unauthorized if no Authorization header is provided', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .send({ quantity: 5 });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/no token provided/i);
  });
});
