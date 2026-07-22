import { Request, Response, NextFunction } from 'express';
import { vehicleService } from '../services/vehicle.service';

export class VehicleController {
  async createVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.addVehicle(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Vehicle added successfully',
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Vehicle updated successfully',
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.deleteVehicle(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Vehicle deleted successfully',
        data: { id: vehicle._id },
      });
    } catch (error) {
      next(error);
    }
  }

  async purchaseVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quantity = req.body.quantity !== undefined ? Number(req.body.quantity) : 1;
      const result = await vehicleService.purchaseVehicle(req.params.id, quantity);
      res.status(200).json({
        status: 'success',
        message: 'Vehicle purchased successfully',
        data: {
          vehicleId: result.vehicle._id,
          purchasedQuantity: result.purchasedQuantity,
          remainingStock: result.remainingStock,
          vehicle: result.vehicle,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await vehicleService.getVehicles(req.query);
      res.status(200).json({
        status: 'success',
        results: result.vehicles.length,
        pagination: result.pagination,
        data: { vehicles: result.vehicles },
      });
    } catch (error) {
      next(error);
    }
  }

  async searchVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await vehicleService.searchVehicles(req.query);
      res.status(200).json({
        status: 'success',
        results: result.vehicles.length,
        pagination: result.pagination,
        data: { vehicles: result.vehicles },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();
