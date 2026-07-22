import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', (req, res, next) => vehicleController.getVehicles(req, res, next));

router.post('/', protect, authorize('admin'), (req, res, next) =>
  vehicleController.createVehicle(req, res, next)
);

export default router;
