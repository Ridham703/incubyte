import { Vehicle, IVehicle } from '../models/vehicle.model';

export class VehicleRepository {
  async create(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(vehicleData);
    return vehicle.save();
  }

  async findById(id: string): Promise<IVehicle | null> {
    return Vehicle.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
  }

  async update(id: string, updateData: Partial<IVehicle>): Promise<IVehicle | null> {
    return Vehicle.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async softDelete(id: string): Promise<IVehicle | null> {
    return Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    ).exec();
  }

  async decrementStock(id: string, quantity = 1): Promise<IVehicle | null> {
    return Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true }, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    ).exec();
  }

  async incrementStock(id: string, quantity = 1): Promise<IVehicle | null> {
    return Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $inc: { stock: quantity } },
      { new: true }
    ).exec();
  }

  async findAll(
    filter: Record<string, unknown> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 },
    skip = 0,
    limit = 10
  ): Promise<IVehicle[]> {
    const activeFilter = { ...filter, isDeleted: { $ne: true } };
    return Vehicle.find(activeFilter).sort(sort).skip(skip).limit(limit).exec();
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    const activeFilter = { ...filter, isDeleted: { $ne: true } };
    return Vehicle.countDocuments(activeFilter).exec();
  }
}

export const vehicleRepository = new VehicleRepository();
