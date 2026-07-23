const request = require('supertest');
const app = require('../app');
const { vehicleRepository } = require('../repositories/vehicle.repository');

jest.mock('../repositories/vehicle.repository');

describe('GET /api/vehicles/search (Vehicle Search API Endpoint)', () => {
  const searchResultsMock = [
    {
      _id: '101',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 42000,
      mileage: 200,
      fuelType: 'Electric',
      transmission: 'Automatic',
      stock: 4,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should search vehicles by make and model using regex filters (200 OK)', async () => {
    vehicleRepository.findAll.mockResolvedValue(searchResultsMock);
    vehicleRepository.count.mockResolvedValue(1);

    const response = await request(app).get('/api/vehicles/search').query({
      make: 'Tesla',
      model: 'Model 3',
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(1);
    expect(vehicleRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        make: { $regex: 'Tesla', $options: 'i' },
        model: { $regex: 'Model 3', $options: 'i' },
      }),
      expect.any(Object),
      0,
      10
    );
  });

  it('should search vehicles by price range, year range, fuel, and transmission', async () => {
    vehicleRepository.findAll.mockResolvedValue(searchResultsMock);
    vehicleRepository.count.mockResolvedValue(1);

    const response = await request(app).get('/api/vehicles/search').query({
      minPrice: 30000,
      maxPrice: 50000,
      minYear: 2020,
      maxYear: 2024,
      fuelType: 'Electric',
      transmission: 'Automatic',
      page: 1,
      limit: 5,
    });

    expect(response.status).toBe(200);
    expect(vehicleRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        price: { $gte: 30000, $lte: 50000 },
        year: { $gte: 2020, $lte: 2024 },
        fuelType: 'Electric',
        transmission: 'Automatic',
      }),
      expect.any(Object),
      0,
      5
    );
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 5,
      totalVehicles: 1,
      totalPages: 1,
    });
  });
});
