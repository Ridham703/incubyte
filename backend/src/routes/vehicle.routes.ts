import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', protect, authorize('admin'), (req, res, next) =>
  vehicleController.createVehicle(req, res, next)
);

export default router;
