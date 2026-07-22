import request from 'supertest';
import app from '../app.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from './setup.js';
import Car from '../models/car.model.js';

describe('Car Inventory API Endpoints (TDD)', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  const sampleCarData = {
    vin: '1HGCR2F83HA000001',
    make: 'Honda',
    model: 'Accord',
    year: 2022,
    price: 28500,
    mileage: 15000,
    color: 'Platinum White Pearl',
    fuelType: 'Gasoline',
    transmission: 'CVT',
    bodyType: 'Sedan',
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588'],
    description: 'Immaculate condition, single owner.',
  };

  describe('POST /api/v1/cars - Add Vehicle', () => {
    it('should successfully add a new vehicle with valid data', async () => {
      const res = await request(app).post('/api/v1/cars').send(sampleCarData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.make).toBe('Honda');
      expect(res.body.data.vin).toBe('1HGCR2F83HA000001');
      expect(res.body.data._id).toBeDefined();
    });

    it('should reject creation if VIN is duplicate', async () => {
      await request(app).post('/api/v1/cars').send(sampleCarData);

      const res = await request(app).post('/api/v1/cars').send(sampleCarData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should fail if required fields are missing', async () => {
      const invalidData = { make: 'Toyota' };
      const res = await request(app).post('/api/v1/cars').send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/cars - List Vehicles with Pagination & Filters', () => {
    beforeEach(async () => {
      await Car.create([
        {
          vin: '1HGCR2F83HA000001',
          make: 'Honda',
          model: 'Accord',
          year: 2022,
          price: 28500,
          mileage: 15000,
          color: 'White',
          fuelType: 'Gasoline',
          transmission: 'CVT',
          bodyType: 'Sedan',
          status: 'Available',
        },
        {
          vin: '4T1B11HK5JU000002',
          make: 'Toyota',
          model: 'Camry',
          year: 2023,
          price: 31000,
          mileage: 8000,
          color: 'Black',
          fuelType: 'Hybrid',
          transmission: 'Automatic',
          bodyType: 'Sedan',
          status: 'Available',
        },
        {
          vin: '5YJ3E1EA7KF000003',
          make: 'Tesla',
          model: 'Model 3',
          year: 2024,
          price: 42000,
          mileage: 2000,
          color: 'Red',
          fuelType: 'Electric',
          transmission: 'Automatic',
          bodyType: 'Sedan',
          status: 'Sold',
        },
      ]);
    });

    it('should return list of vehicles with pagination metadata', async () => {
      const res = await request(app).get('/api/v1/cars');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(3);
      expect(res.body.pagination.total).toBe(3);
    });

    it('should filter vehicles by make', async () => {
      const res = await request(app).get('/api/v1/cars?make=Tesla');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].make).toBe('Tesla');
    });

    it('should filter vehicles by status', async () => {
      const res = await request(app).get('/api/v1/cars?status=Sold');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].model).toBe('Model 3');
    });

    it('should search vehicles by query string', async () => {
      const res = await request(app).get('/api/v1/cars?query=camry');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].make).toBe('Toyota');
    });

    it('should sort vehicles by price descending', async () => {
      const res = await request(app).get('/api/v1/cars?sort=price_desc');

      expect(res.statusCode).toBe(200);
      expect(res.body.data[0].price).toBe(42000);
      expect(res.body.data[2].price).toBe(28500);
    });
  });

  describe('GET /api/v1/cars/:id - Vehicle Details', () => {
    it('should return vehicle details for valid ID', async () => {
      const created = await Car.create(sampleCarData);

      const res = await request(app).get(`/api/v1/cars/${created._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vin).toBe('1HGCR2F83HA000001');
    });

    it('should return 404 for non-existent vehicle ID', async () => {
      const fakeId = '669e2c608f1b2c45e89d1234';
      const res = await request(app).get(`/api/v1/cars/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/cars/:id - Update Vehicle', () => {
    it('should update vehicle details', async () => {
      const created = await Car.create(sampleCarData);

      const res = await request(app)
        .put(`/api/v1/cars/${created._id}`)
        .send({ price: 27000, mileage: 16000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(27000);
      expect(res.body.data.mileage).toBe(16000);
    });
  });

  describe('PATCH /api/v1/cars/:id/status - Update Vehicle Status', () => {
    it('should update vehicle status to Sold', async () => {
      const created = await Car.create(sampleCarData);

      const res = await request(app)
        .patch(`/api/v1/cars/${created._id}/status`)
        .send({ status: 'Sold' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Sold');
    });

    it('should reject invalid status', async () => {
      const created = await Car.create(sampleCarData);

      const res = await request(app)
        .patch(`/api/v1/cars/${created._id}/status`)
        .send({ status: 'Destroyed' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/cars/:id - Remove Vehicle', () => {
    it('should delete vehicle from inventory', async () => {
      const created = await Car.create(sampleCarData);

      const res = await request(app).delete(`/api/v1/cars/${created._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const found = await Car.findById(created._id);
      expect(found).toBeNull();
    });
  });

  describe('GET /api/v1/cars/stats - Dashboard Statistics', () => {
    it('should aggregate correct inventory statistics', async () => {
      await Car.create([
        {
          vin: '1HGCR2F83HA000001',
          make: 'Honda',
          model: 'Accord',
          year: 2022,
          price: 20000,
          mileage: 15000,
          color: 'White',
          fuelType: 'Gasoline',
          transmission: 'CVT',
          bodyType: 'Sedan',
          status: 'Available',
        },
        {
          vin: '4T1B11HK5JU000002',
          make: 'Toyota',
          model: 'Camry',
          year: 2023,
          price: 40000,
          mileage: 8000,
          color: 'Black',
          fuelType: 'Hybrid',
          transmission: 'Automatic',
          bodyType: 'Sedan',
          status: 'Sold',
        },
      ]);

      const res = await request(app).get('/api/v1/cars/stats');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalVehicles).toBe(2);
      expect(res.body.data.availableVehicles).toBe(1);
      expect(res.body.data.totalInventoryValuation).toBe(60000);
      expect(res.body.data.averageVehiclePrice).toBe(30000);
    });
  });
});
