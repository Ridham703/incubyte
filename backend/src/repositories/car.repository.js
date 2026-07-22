import Car from '../models/car.model.js';

class CarRepository {
  async create(carData) {
    const car = new Car(carData);
    return await car.save();
  }

  async findById(id) {
    return await Car.findById(id);
  }

  async findByVin(vin) {
    return await Car.findOne({ vin: vin.toUpperCase() });
  }

  async findAll({ filter = {}, query = '', sort = '-createdAt', page = 1, limit = 10 }) {
    const searchCondition = {};

    if (query) {
      searchCondition.$or = [
        { make: { $regex: query, $options: 'i' } },
        { model: { $regex: query, $options: 'i' } },
        { vin: { $regex: query, $options: 'i' } },
        { color: { $regex: query, $options: 'i' } },
      ];
    }

    const finalQuery = { ...filter, ...searchCondition };

    const skip = (page - 1) * limit;

    const [cars, total] = await Promise.all([
      Car.find(finalQuery).sort(sort).skip(skip).limit(limit),
      Car.countDocuments(finalQuery),
    ]);

    return {
      cars,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async update(id, updateData) {
    return await Car.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateStatus(id, status) {
    return await Car.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Car.findByIdAndDelete(id);
  }

  async getInventoryStats() {
    const [totalVehicles, availableCount, valuationResult, makeDistribution, statusDistribution] =
      await Promise.all([
        Car.countDocuments(),
        Car.countDocuments({ status: 'Available' }),
        Car.aggregate([
          {
            $group: {
              _id: null,
              totalValuation: { $sum: '$price' },
              avgPrice: { $avg: '$price' },
            },
          },
        ]),
        Car.aggregate([
          {
            $group: {
              _id: '$make',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),
        Car.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    const stats = valuationResult[0] || { totalValuation: 0, avgPrice: 0 };

    return {
      totalVehicles,
      availableVehicles: availableCount,
      totalInventoryValuation: Math.round(stats.totalValuation || 0),
      averageVehiclePrice: Math.round(stats.avgPrice || 0),
      makeDistribution: makeDistribution.map((item) => ({ make: item._id, count: item.count })),
      statusDistribution: statusDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }
}

export default new CarRepository();
