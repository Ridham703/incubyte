import express from 'express';
import {
  createCar,
  getCars,
  getCarById,
  updateCar,
  updateCarStatus,
  deleteCar,
  getCarStats,
} from '../controllers/car.controller.js';

const router = express.Router();

router.get('/stats', getCarStats);
router.route('/').post(createCar).get(getCars);
router.route('/:id').get(getCarById).put(updateCar).delete(deleteCar);
router.patch('/:id/status', updateCarStatus);

export default router;
