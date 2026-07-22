import carRepository from '../repositories/car.repository.js';

class CarService {
  async addCar(carData) {
    if (!carData.vin || carData.vin.trim().length !== 17) {
      const error = new Error('VIN must be exactly 17 characters long');
      error.statusCode = 400;
      throw error;
    }

    const existingVin = await carRepository.findByVin(carData.vin);
    if (existingVin) {
      const error = new Error(`Vehicle with VIN '${carData.vin.toUpperCase()}' already exists`);
      error.statusCode = 400;
      throw error;
    }

    if (carData.price !== undefined && carData.price < 0) {
      const error = new Error('Price cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    if (carData.mileage !== undefined && carData.mileage < 0) {
      const error = new Error('Mileage cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    return await carRepository.create(carData);
  }

  async getCarById(id) {
    const car = await carRepository.findById(id);
    if (!car) {
      const error = new Error(`Vehicle with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return car;
  }

  async getAllCars(queryParams) {
    const { query, make, status, fuelType, bodyType, minPrice, maxPrice, minYear, maxYear, sort, page = 1, limit = 10 } = queryParams;

    const filter = {};

    if (make) filter.make = { $regex: make, $options: 'i' };
    if (status) filter.status = status;
    if (fuelType) filter.fuelType = fuelType;
    if (bodyType) filter.bodyType = bodyType;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') filter.price.$lte = Number(maxPrice);
    }

    if (minYear !== undefined || maxYear !== undefined) {
      filter.year = {};
      if (minYear !== undefined && minYear !== '') filter.year.$gte = Number(minYear);
      if (maxYear !== undefined && maxYear !== '') filter.year.$lte = Number(maxYear);
    }

    let sortOption = '-createdAt';
    if (sort === 'price_asc') sortOption = 'price';
    if (sort === 'price_desc') sortOption = '-price';
    if (sort === 'year_desc') sortOption = '-year';
    if (sort === 'year_asc') sortOption = 'year';
    if (sort === 'mileage_asc') sortOption = 'mileage';

    return await carRepository.findAll({
      filter,
      query,
      sort: sortOption,
      page: Number(page),
      limit: Number(limit),
    });
  }

  async updateCar(id, updateData) {
    const car = await carRepository.findById(id);
    if (!car) {
      const error = new Error(`Vehicle with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    if (updateData.vin && updateData.vin.toUpperCase() !== car.vin) {
      const existingVin = await carRepository.findByVin(updateData.vin);
      if (existingVin) {
        const error = new Error(`Vehicle with VIN '${updateData.vin.toUpperCase()}' already exists`);
        error.statusCode = 400;
        throw error;
      }
    }

    return await carRepository.update(id, updateData);
  }

  async updateCarStatus(id, status) {
    const validStatuses = ['Available', 'Sold', 'Reserved', 'In Maintenance'];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const car = await carRepository.findById(id);
    if (!car) {
      const error = new Error(`Vehicle with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return await carRepository.updateStatus(id, status);
  }

  async deleteCar(id) {
    const car = await carRepository.findById(id);
    if (!car) {
      const error = new Error(`Vehicle with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return await carRepository.delete(id);
  }

  async getInventoryStats() {
    return await carRepository.getInventoryStats();
  }
}

export default new CarService();
