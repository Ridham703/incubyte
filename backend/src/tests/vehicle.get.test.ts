import request from 'supertest';
import app from '../app';
import { vehicleRepository } from '../repositories/vehicle.repository';

jest.mock('../repositories/vehicle.repository');

describe('GET /api/vehicles (Fetch Vehicles - Pagination, Sorting, Filtering)', () => {
  const mockVehiclesList = [
    {
      _id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      price: 32000,
      mileage: 1000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      stock: 5,
    },
    {
      _id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      price: 26000,
      mileage: 5000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      stock: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of vehicles with default pagination metadata (200 OK)', async () => {
    (vehicleRepository.findAll as jest.Mock).mockResolvedValue(mockVehiclesList);
    (vehicleRepository.count as jest.Mock).mockResolvedValue(2);

    const response = await request(app).get('/api/vehicles');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(2);
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      totalVehicles: 2,
      totalPages: 1,
    });
    expect(response.body.data.vehicles).toHaveLength(2);
  });

  it('should pass correct filter, sort, and pagination options to repository', async () => {
    (vehicleRepository.findAll as jest.Mock).mockResolvedValue([mockVehiclesList[0]]);
    (vehicleRepository.count as jest.Mock).mockResolvedValue(1);

    const response = await request(app).get('/api/vehicles').query({
      page: 2,
      limit: 1,
      make: 'Toyota',
      fuelType: 'Hybrid',
      minPrice: 30000,
      maxPrice: 40000,
      sortBy: 'price',
      sortOrder: 'asc',
    });

    expect(response.status).toBe(200);
    expect(vehicleRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        make: 'Toyota',
        fuelType: 'Hybrid',
        price: { $gte: 30000, $lte: 40000 },
      }),
      { price: 1 },
      1, // skip: (page 2 - 1) * 1 = 1
      1  // limit: 1
    );
    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 1,
      totalVehicles: 1,
      totalPages: 1,
    });
  });

  it('should support search keyword filter across make and model', async () => {
    (vehicleRepository.findAll as jest.Mock).mockResolvedValue(mockVehiclesList);
    (vehicleRepository.count as jest.Mock).mockResolvedValue(2);

    const response = await request(app).get('/api/vehicles').query({
      search: 'Toy',
    });

    expect(response.status).toBe(200);
    expect(vehicleRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: [
          { make: { $regex: 'Toy', $options: 'i' } },
          { model: { $regex: 'Toy', $options: 'i' } },
        ],
      }),
      expect.any(Object),
      0,
      10
    );
  });
});
