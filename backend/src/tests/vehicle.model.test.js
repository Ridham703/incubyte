const { Vehicle } = require('../models/vehicle.model');

describe('Vehicle Model Schema & Validation', () => {
  const validVehicleData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 32000,
    mileage: 1500,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb',
    description: 'Brand new hybrid sedan with premium features.',
  };

  it('should validate a vehicle with all correct fields', () => {
    const vehicle = new Vehicle(validVehicleData);
    const err = vehicle.validateSync();
    expect(err).toBeUndefined();
    expect(vehicle.make).toBe('Toyota');
    expect(vehicle.model).toBe('Camry');
    expect(vehicle.year).toBe(2024);
    expect(vehicle.price).toBe(32000);
    expect(vehicle.mileage).toBe(1500);
    expect(vehicle.fuelType).toBe('Hybrid');
    expect(vehicle.transmission).toBe('Automatic');
    expect(vehicle.stock).toBe(5);
  });

  it('should fail validation if required fields are missing', () => {
    const vehicle = new Vehicle({});
    const err = vehicle.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['make']).toBeDefined();
    expect(err.errors['model']).toBeDefined();
    expect(err.errors['year']).toBeDefined();
    expect(err.errors['price']).toBeDefined();
    expect(err.errors['mileage']).toBeDefined();
    expect(err.errors['fuelType']).toBeDefined();
    expect(err.errors['transmission']).toBeDefined();
  });

  it('should fail validation if price is negative', () => {
    const vehicle = new Vehicle({ ...validVehicleData, price: -500 });
    const err = vehicle.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['price']).toBeDefined();
    expect(err.errors['price'].message).toMatch(/price cannot be negative/i);
  });

  it('should fail validation if mileage is negative', () => {
    const vehicle = new Vehicle({ ...validVehicleData, mileage: -100 });
    const err = vehicle.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['mileage']).toBeDefined();
    expect(err.errors['mileage'].message).toMatch(/mileage cannot be negative/i);
  });

  it('should fail validation if stock is negative', () => {
    const vehicle = new Vehicle({ ...validVehicleData, stock: -2 });
    const err = vehicle.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['stock']).toBeDefined();
    expect(err.errors['stock'].message).toMatch(/stock cannot be negative/i);
  });

  it('should fail validation if fuelType is invalid enum value', () => {
    const vehicle = new Vehicle({ ...validVehicleData, fuelType: 'Kerosene' });
    const err = vehicle.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['fuelType']).toBeDefined();
  });

  it('should fail validation if transmission is invalid enum value', () => {
    const vehicle = new Vehicle({
      ...validVehicleData,
      transmission: 'Direct',
    });
    const err = vehicle.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['transmission']).toBeDefined();
  });

  it('should set default values for stock and image if omitted', () => {
    const vehicle = new Vehicle({
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      price: 25000,
      mileage: 5000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
    });
    const err = vehicle.validateSync();
    expect(err).toBeUndefined();
    expect(vehicle.stock).toBe(1);
    expect(vehicle.image).toBeDefined();
  });
});
