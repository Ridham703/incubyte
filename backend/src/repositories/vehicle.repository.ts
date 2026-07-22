import { Vehicle, IVehicle } from '../models/vehicle.model';

export class VehicleRepository {
  async create(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(vehicleData);
    return vehicle.save();
  }
}

export const vehicleRepository = new VehicleRepository();
