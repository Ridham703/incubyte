import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/search', (req, res, next) => vehicleController.searchVehicles(req, res, next));
router.get('/', (req, res, next) => vehicleController.getVehicles(req, res, next));

router.post('/', protect, authorize('admin'), (req, res, next) =>
  vehicleController.createVehicle(req, res, next)
);

router.put('/:id', protect, authorize('admin'), (req, res, next) =>
  vehicleController.updateVehicle(req, res, next)
);

router.patch('/:id', protect, authorize('admin'), (req, res, next) =>
  vehicleController.updateVehicle(req, res, next)
);

router.delete('/:id', protect, authorize('admin'), (req, res, next) =>
  vehicleController.deleteVehicle(req, res, next)
);

export default router;
