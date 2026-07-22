import { Vehicle, IVehicle } from '../models/vehicle.model';

export class VehicleRepository {
  async create(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(vehicleData);
    return vehicle.save();
  }

  async findById(id: string): Promise<IVehicle | null> {
    return Vehicle.findById(id).exec();
  }

  async update(id: string, updateData: Partial<IVehicle>): Promise<IVehicle | null> {
    return Vehicle.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async findAll(
    filter: Record<string, unknown> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 },
    skip = 0,
    limit = 10
  ): Promise<IVehicle[]> {
    return Vehicle.find(filter).sort(sort).skip(skip).limit(limit).exec();
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return Vehicle.countDocuments(filter).exec();
  }
}

export const vehicleRepository = new VehicleRepository();
