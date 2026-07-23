const { Router } = require('express');
const { vehicleController } = require('../controllers/vehicle.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

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

router.post('/:id/purchase', protect, (req, res, next) =>
  vehicleController.purchaseVehicle(req, res, next)
);

router.post('/:id/restock', protect, authorize('admin'), (req, res, next) =>
  vehicleController.restockVehicle(req, res, next)
);

module.exports = router;
