import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { vehicleRepository } from '../repositories/vehicle.repository';

jest.mock('../repositories/vehicle.repository');

describe('PUT /api/vehicles/:id (Update Vehicle API Endpoint - Admin Only)', () => {
  const secret = 'test_secret_key';
  const adminToken = jwt.sign({ id: 'admin123', role: 'admin' }, secret);
  const userToken = jwt.sign({ id: 'user123', role: 'user' }, secret);
  const vehicleId = '607f1f77bcf86cd799439011';

  const existingVehicle = {
    _id: vehicleId,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28000,
    mileage: 12000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    stock: 2,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
    description: 'Pre-owned sedan in clean condition.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = secret;
  });

  it('should allow an admin to update a vehicle successfully (200 OK)', async () => {
    const updateData = { price: 27000, mileage: 12500, stock: 3 };
    const updatedVehicle = { ...existingVehicle, ...updateData };

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(existingVehicle);
    (vehicleRepository.update as jest.Mock).mockResolvedValue(updatedVehicle);

    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toMatch(/updated successfully/i);
    expect(response.body.data.vehicle.price).toBe(27000);
    expect(response.body.data.vehicle.stock).toBe(3);
  });

  it('should return 404 Not Found if vehicle does not exist', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 25000 });

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/vehicle not found/i);
  });

  it('should return 403 Forbidden when a non-admin user attempts to update a vehicle', async () => {
    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 25000 });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/access denied: admin privileges required/i);
  });

  it('should return 401 Unauthorized if no Authorization header is provided', async () => {
    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .send({ price: 25000 });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/no token provided/i);
  });

  it('should return 400 Bad Request if negative values are provided for numeric fields', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(existingVehicle);

    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: -1000 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/price cannot be negative/i);
  });

  it('should return 400 Bad Request if invalid fuelType or transmission enum is provided', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(existingVehicle);

    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ fuelType: 'Solar' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/valid fuel type/i);
  });
});
