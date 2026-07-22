import carService from '../services/car.service.js';

export const createCar = async (req, res, next) => {
  try {
    const car = await carService.addCar(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle added to inventory successfully',
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

export const getCars = async (req, res, next) => {
  try {
    const result = await carService.getAllCars(req.query);
    res.status(200).json({
      success: true,
      data: result.cars,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (req, res, next) => {
  try {
    const car = await carService.getCarById(req.params.id);
    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCar = async (req, res, next) => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Vehicle details updated successfully',
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCarStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const car = await carService.updateCarStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      message: `Vehicle status updated to '${status}'`,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCar = async (req, res, next) => {
  try {
    await carService.deleteCar(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Vehicle removed from inventory successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCarStats = async (req, res, next) => {
  try {
    const stats = await carService.getInventoryStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
