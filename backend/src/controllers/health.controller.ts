import { Request, Response } from 'express';

export class HealthController {
  public getHealth(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'UP',
      message: 'Car Dealership Inventory API is running',
      timestamp: new Date().toISOString(),
    });
  }
}

export const healthController = new HealthController();
