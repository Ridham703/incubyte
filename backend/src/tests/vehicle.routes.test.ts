import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { vehicleRepository } from '../repositories/vehicle.repository';

jest.mock('../repositories/vehicle.repository');

describe('Vehicle API Endpoints (/api/vehicles)', () => {
  const secret = 'test_secret_key';
  const adminToken = jwt.sign({ id: 'admin123', role: 'admin' }, secret);
  const userToken = jwt.sign({ id: 'user123', role: 'user' }, secret);

  const sampleVehicleData = {
    make: 'Toyota',
    model: 'RAV4',
    year: 2024,
    price: 34000,
    mileage: 50,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    stock: 3,
    description: 'Reliable SUV with great fuel economy.',
  };

  const createdVehicle = {
    _id: '607f1f77bcf86cd799439022',
    ...sampleVehicleData,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = secret;
  });

  describe('POST /api/vehicles (Add Vehicle - Admin Only)', () => {
    it('should allow an admin to add a new vehicle successfully (201 Created)', async () => {
      (vehicleRepository.create as jest.Mock).mockResolvedValue(createdVehicle);

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleVehicleData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.vehicle).toBeDefined();
      expect(response.body.data.vehicle.make).toBe('Toyota');
      expect(response.body.data.vehicle.model).toBe('RAV4');
    });

    it('should return 403 Forbidden when a non-admin user attempts to add a vehicle', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicleData);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/access denied: admin privileges required/i);
    });

    it('should return 401 Unauthorized if no Authorization token is provided', async () => {
      const response = await request(app).post('/api/vehicles').send(sampleVehicleData);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/no token provided/i);
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Toyota',
          // missing model, year, price, etc.
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 Bad Request if numeric fields are negative', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...sampleVehicleData,
          price: -5000,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/price cannot be negative/i);
    });

    it('should return 400 Bad Request if fuelType or transmission enum is invalid', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...sampleVehicleData,
          fuelType: 'Water',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/valid fuel type/i);
    });
  });
});
