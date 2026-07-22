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
}

export const vehicleController = new VehicleController();
