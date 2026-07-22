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

export class VehicleService {
  constructor(private vehicleRepo: VehicleRepository = vehicleRepository) {}

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
}

export const vehicleService = new VehicleService();
