const { Vehicle } = require('../models/vehicle.model');

class VehicleRepository {
  async create(vehicleData) {
    const vehicle = new Vehicle(vehicleData);
    return vehicle.save();
  }

  async findById(id) {
    return Vehicle.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
  }

  async update(id, updateData) {
    return Vehicle.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async softDelete(id) {
    return Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    ).exec();
  }

  async decrementStock(id, quantity = 1) {
    return Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true }, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    ).exec();
  }

  async incrementStock(id, quantity = 1) {
    return Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $inc: { stock: quantity } },
      { new: true }
    ).exec();
  }

  async findAll(filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 10) {
    const activeFilter = { ...filter, isDeleted: { $ne: true } };
    return Vehicle.find(activeFilter).sort(sort).skip(skip).limit(limit).exec();
  }

  async count(filter = {}) {
    const activeFilter = { ...filter, isDeleted: { $ne: true } };
    return Vehicle.countDocuments(activeFilter).exec();
  }
}

const vehicleRepository = new VehicleRepository();

module.exports = {
  VehicleRepository,
  vehicleRepository,
};
