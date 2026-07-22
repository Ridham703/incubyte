import { vehicleRepository, VehicleRepository } from '../repositories/vehicle.repository';
import { IVehicle, FuelType, TransmissionType } from '../models/vehicle.model';
import { AppError } from '../middleware/errorHandler';

export interface CreateVehicleDTO {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  stock?: number;
  image?: string;
  description?: string;
}

export type UpdateVehicleDTO = Partial<CreateVehicleDTO>;

export interface GetVehiclesQuery {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  make?: string;
  model?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minYear?: string | number;
  maxYear?: string | number;
  search?: string;
}

export interface PaginatedVehiclesResponse {
  vehicles: IVehicle[];
  pagination: {
    page: number;
    limit: number;
    totalVehicles: number;
    totalPages: number;
  };
}

export class VehicleService {
  constructor(private vehicleRepo: VehicleRepository = vehicleRepository) { }

  async addVehicle(data: CreateVehicleDTO): Promise<IVehicle> {
    if (!data.make || !data.model || !data.year || data.price === undefined || data.mileage === undefined || !data.fuelType || !data.transmission) {
      throw new AppError('Please provide all required vehicle fields: make, model, year, price, mileage, fuelType, transmission', 400);
    }

    if (typeof data.price === 'number' && data.price < 0) {
      throw new AppError('Price cannot be negative', 400);
    }

    if (typeof data.mileage === 'number' && data.mileage < 0) {
      throw new AppError('Mileage cannot be negative', 400);
    }

    if (data.stock !== undefined && typeof data.stock === 'number' && data.stock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }

    const validFuelTypes: FuelType[] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
    if (!validFuelTypes.includes(data.fuelType)) {
      throw new AppError(`Please provide a valid fuel type (${validFuelTypes.join(', ')})`, 400);
    }

    const validTransmissions: TransmissionType[] = ['Automatic', 'Manual', 'CVT'];
    if (!validTransmissions.includes(data.transmission)) {
      throw new AppError(`Please provide a valid transmission type (${validTransmissions.join(', ')})`, 400);
    }

    const currentYear = new Date().getFullYear();
    if (typeof data.year === 'number' && (data.year < 1900 || data.year > currentYear + 1)) {
      throw new AppError(`Year must be between 1900 and ${currentYear + 1}`, 400);
    }

    return this.vehicleRepo.create(data);
  }

  async updateVehicle(id: string, updateData: UpdateVehicleDTO): Promise<IVehicle> {
    const existing = await this.vehicleRepo.findById(id);
    if (!existing) {
      throw new AppError('Vehicle not found', 404);
    }

    if (updateData.price !== undefined && typeof updateData.price === 'number' && updateData.price < 0) {
      throw new AppError('Price cannot be negative', 400);
    }

    if (updateData.mileage !== undefined && typeof updateData.mileage === 'number' && updateData.mileage < 0) {
      throw new AppError('Mileage cannot be negative', 400);
    }

    if (updateData.stock !== undefined && typeof updateData.stock === 'number' && updateData.stock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }

    if (updateData.fuelType) {
      const validFuelTypes: FuelType[] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
      if (!validFuelTypes.includes(updateData.fuelType)) {
        throw new AppError(`Please provide a valid fuel type (${validFuelTypes.join(', ')})`, 400);
      }
    }

    if (updateData.transmission) {
      const validTransmissions: TransmissionType[] = ['Automatic', 'Manual', 'CVT'];
      if (!validTransmissions.includes(updateData.transmission)) {
        throw new AppError(`Please provide a valid transmission type (${validTransmissions.join(', ')})`, 400);
      }
    }

    if (updateData.year !== undefined && typeof updateData.year === 'number') {
      const currentYear = new Date().getFullYear();
      if (updateData.year < 1900 || updateData.year > currentYear + 1) {
        throw new AppError(`Year must be between 1900 and ${currentYear + 1}`, 400);
      }
    }

    const updated = await this.vehicleRepo.update(id, updateData);
    if (!updated) {
      throw new AppError('Vehicle not found', 404);
    }

    return updated;
  }

  async deleteVehicle(id: string): Promise<IVehicle> {
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

  async purchaseVehicle(
    id: string,
    quantity = 1
  ): Promise<{ vehicle: IVehicle; purchasedQuantity: number; remainingStock: number }> {
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

  async restockVehicle(
    id: string,
    quantity: number
  ): Promise<{ vehicle: IVehicle; addedQuantity: number; newStock: number }> {
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

  async getVehicles(query: GetVehiclesQuery): Promise<PaginatedVehiclesResponse> {
    const page = Math.max(1, parseInt(String(query.page || '1'), 10));
    const limit = Math.max(1, parseInt(String(query.limit || '10'), 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.make) {
      filter.make = String(query.make);
    }

    if (query.model) {
      filter.model = String(query.model);
    }

    if (query.fuelType) {
      filter.fuelType = String(query.fuelType);
    }

    if (query.transmission) {
      filter.transmission = String(query.transmission);
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (query.minPrice !== undefined) {
        priceFilter.$gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        priceFilter.$lte = Number(query.maxPrice);
      }
      filter.price = priceFilter;
    }

    if (query.minYear !== undefined || query.maxYear !== undefined) {
      const yearFilter: Record<string, number> = {};
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

    const sortField = String(query.sortBy || 'createdAt');
    const sortOrderVal: 1 | -1 = query.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrderVal };

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

  async searchVehicles(query: GetVehiclesQuery): Promise<PaginatedVehiclesResponse> {
    const page = Math.max(1, parseInt(String(query.page || '1'), 10));
    const limit = Math.max(1, parseInt(String(query.limit || '10'), 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.make) {
      filter.make = { $regex: String(query.make), $options: 'i' };
    }

    if (query.model) {
      filter.model = { $regex: String(query.model), $options: 'i' };
    }

    if (query.fuelType) {
      filter.fuelType = String(query.fuelType);
    }

    if (query.transmission) {
      filter.transmission = String(query.transmission);
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (query.minPrice !== undefined) {
        priceFilter.$gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        priceFilter.$lte = Number(query.maxPrice);
      }
      filter.price = priceFilter;
    }

    if (query.minYear !== undefined || query.maxYear !== undefined) {
      const yearFilter: Record<string, number> = {};
      if (query.minYear !== undefined) {
        yearFilter.$gte = Number(query.minYear);
      }
      if (query.maxYear !== undefined) {
        yearFilter.$lte = Number(query.maxYear);
      }
      filter.year = yearFilter;
    }

    const sortField = String(query.sortBy || 'createdAt');
    const sortOrderVal: 1 | -1 = query.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrderVal };

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

export const vehicleService = new VehicleService();
