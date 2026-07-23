const { vehicleRepository } = require('../repositories/vehicle.repository');
const { AppError } = require('../middleware/errorHandler');

const VALID_FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const VALID_TRANSMISSION_TYPES = ['Automatic', 'Manual', 'CVT'];

class VehicleService {
  constructor(vehicleRepo = vehicleRepository) {
    this.vehicleRepo = vehicleRepo;
  }

  validateVehicleData(data, isUpdate = false) {
    if (!isUpdate) {
      if (
        !data.make ||
        !data.model ||
        !data.year ||
        data.price === undefined ||
        data.mileage === undefined ||
        !data.fuelType ||
        !data.transmission
      ) {
        throw new AppError(
          'Please provide all required vehicle fields: make, model, year, price, mileage, fuelType, transmission',
          400
        );
      }
    }

    if (data.price !== undefined && typeof data.price === 'number' && data.price < 0) {
      throw new AppError('Price cannot be negative', 400);
    }

    if (data.mileage !== undefined && typeof data.mileage === 'number' && data.mileage < 0) {
      throw new AppError('Mileage cannot be negative', 400);
    }

    if (data.stock !== undefined && typeof data.stock === 'number' && data.stock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }

    if (data.fuelType && !VALID_FUEL_TYPES.includes(data.fuelType)) {
      throw new AppError(`Please provide a valid fuel type (${VALID_FUEL_TYPES.join(', ')})`, 400);
    }

    if (data.transmission && !VALID_TRANSMISSION_TYPES.includes(data.transmission)) {
      throw new AppError(
        `Please provide a valid transmission type (${VALID_TRANSMISSION_TYPES.join(', ')})`,
        400
      );
    }

    if (data.year !== undefined && typeof data.year === 'number') {
      const currentYear = new Date().getFullYear();
      if (data.year < 1900 || data.year > currentYear + 1) {
        throw new AppError(`Year must be between 1900 and ${currentYear + 1}`, 400);
      }
    }
  }

  buildVehicleFilter(query, regexTextSearch = false) {
    const filter = {};

    if (query.make) {
      filter.make = regexTextSearch
        ? { $regex: String(query.make), $options: 'i' }
        : String(query.make);
    }

    if (query.model) {
      filter.model = regexTextSearch
        ? { $regex: String(query.model), $options: 'i' }
        : String(query.model);
    }

    if (query.fuelType) {
      filter.fuelType = String(query.fuelType);
    }

    if (query.transmission) {
      filter.transmission = String(query.transmission);
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter = {};
      if (query.minPrice !== undefined) {
        priceFilter.$gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        priceFilter.$lte = Number(query.maxPrice);
      }
      filter.price = priceFilter;
    }

    if (query.minYear !== undefined || query.maxYear !== undefined) {
      const yearFilter = {};
      if (query.minYear !== undefined) {
        yearFilter.$gte = Number(query.minYear);
      }
      if (query.maxYear !== undefined) {
        yearFilter.$lte = Number(query.maxYear);
      }
      filter.year = yearFilter;
    }

    if (query.search) {
      const searchRegex = new RegExp(String(query.search), 'i');
      filter.$or = [
        { make: { $regex: searchRegex.source, $options: 'i' } },
        { model: { $regex: searchRegex.source, $options: 'i' } },
      ];
    }

    return filter;
  }

  buildSort(query) {
    const sortField = String(query.sortBy || 'createdAt');
    const sortOrderVal = query.sortOrder === 'asc' ? 1 : -1;
    return { [sortField]: sortOrderVal };
  }

  async addVehicle(data) {
    this.validateVehicleData(data, false);
    return this.vehicleRepo.create(data);
  }

  async updateVehicle(id, updateData) {
    const existing = await this.vehicleRepo.findById(id);
    if (!existing) {
      throw new AppError('Vehicle not found', 404);
    }

    this.validateVehicleData(updateData, true);

    const updated = await this.vehicleRepo.update(id, updateData);
    if (!updated) {
      throw new AppError('Vehicle not found', 404);
    }

    return updated;
  }

  async deleteVehicle(id) {
    const existing = await this.vehicleRepo.findById(id);
    if (!existing) {
      throw new AppError('Vehicle not found', 404);
    }

    const deleted = await this.vehicleRepo.softDelete(id);
    if (!deleted) {
      throw new AppError('Vehicle not found', 404);
    }

    return deleted;
  }

  async purchaseVehicle(id, quantity = 1) {
    if (quantity < 1) {
      throw new AppError('Purchase quantity must be at least 1', 400);
    }

    const vehicle = await this.vehicleRepo.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (vehicle.stock < quantity) {
      throw new AppError('Insufficient stock available for purchase', 400);
    }

    const updated = await this.vehicleRepo.decrementStock(id, quantity);
    if (!updated) {
      throw new AppError('Insufficient stock available for purchase', 400);
    }

    return {
      vehicle: updated,
      purchasedQuantity: quantity,
      remainingStock: updated.stock,
    };
  }

  async restockVehicle(id, quantity) {
    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      throw new AppError('Restock quantity must be at least 1', 400);
    }

    const vehicle = await this.vehicleRepo.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    const updated = await this.vehicleRepo.incrementStock(id, quantity);
    if (!updated) {
      throw new AppError('Vehicle not found', 404);
    }

    return {
      vehicle: updated,
      addedQuantity: quantity,
      newStock: updated.stock,
    };
  }

  async getVehicles(query) {
    const page = Math.max(1, parseInt(String(query.page || '1'), 10));
    const limit = Math.max(1, parseInt(String(query.limit || '10'), 10));
    const skip = (page - 1) * limit;

    const filter = this.buildVehicleFilter(query, false);
    const sort = this.buildSort(query);

    const [vehicles, totalVehicles] = await Promise.all([
      this.vehicleRepo.findAll(filter, sort, skip, limit),
      this.vehicleRepo.count(filter),
    ]);

    const totalPages = Math.ceil(totalVehicles / limit) || 1;

    return {
      vehicles,
      pagination: {
        page,
        limit,
        totalVehicles,
        totalPages,
      },
    };
  }

  async searchVehicles(query) {
    const page = Math.max(1, parseInt(String(query.page || '1'), 10));
    const limit = Math.max(1, parseInt(String(query.limit || '10'), 10));
    const skip = (page - 1) * limit;

    const filter = this.buildVehicleFilter(query, true);
    const sort = this.buildSort(query);

    const [vehicles, totalVehicles] = await Promise.all([
      this.vehicleRepo.findAll(filter, sort, skip, limit),
      this.vehicleRepo.count(filter),
    ]);

    const totalPages = Math.ceil(totalVehicles / limit) || 1;

    return {
      vehicles,
      pagination: {
        page,
        limit,
        totalVehicles,
        totalPages,
      },
    };
  }
}

const vehicleService = new VehicleService();

module.exports = {
  VALID_FUEL_TYPES,
  VALID_TRANSMISSION_TYPES,
  VehicleService,
  vehicleService,
};
