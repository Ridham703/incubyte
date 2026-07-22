import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { vehicleRepository } from '../repositories/vehicle.repository';

jest.mock('../repositories/vehicle.repository');

describe('POST /api/vehicles/:id/purchase (Purchase Vehicle API Endpoint)', () => {
  const secret = 'test_secret_key';
  const userToken = jwt.sign({ id: 'user123', role: 'user' }, secret);
  const vehicleId = '607f1f77bcf86cd799439011';

  const inStockVehicle = {
    _id: vehicleId,
    make: 'Tesla',
    model: 'Model Y',
    year: 2024,
    price: 52000,
    mileage: 10,
    fuelType: 'Electric',
    transmission: 'Automatic',
    stock: 5,
    isDeleted: false,
  };

  const outOfStockVehicle = {
    ...inStockVehicle,
    stock: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = secret;
  });

  it('should allow an authenticated user to purchase a vehicle and decrement stock (200 OK)', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(inStockVehicle);
    (vehicleRepository.decrementStock as jest.Mock).mockResolvedValue({
      ...inStockVehicle,
      stock: 4,
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 1 });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toMatch(/purchased successfully/i);
    expect(response.body.data.purchasedQuantity).toBe(1);
    expect(response.body.data.remainingStock).toBe(4);
  });

  it('should prevent purchase and return 400 Bad Request if stock is insufficient', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(outOfStockVehicle);

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/insufficient stock/i);
  });

  it('should return 404 Not Found if vehicle does not exist', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 1 });

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/vehicle not found/i);
  });

  it('should return 401 Unauthorized if no Authorization header is provided', async () => {
    const response = await request(app).post(`/api/vehicles/${vehicleId}/purchase`);

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/no token provided/i);
  });

  it('should return 400 Bad Request if purchase quantity is invalid (e.g. <= 0)', async () => {
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(inStockVehicle);

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 0 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/quantity must be at least 1/i);
  });
});
