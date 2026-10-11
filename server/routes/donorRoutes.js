import { Router } from 'express';
import {
  getDonors,
  getDonorByUserId,
  createDonor,
  updateDonor,
  toggleDonorAvailability,
  deleteDonor,
} from '../controllers/donorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getDonors);
router.get('/me', authMiddleware, getDonorByUserId);
router.post('/', authMiddleware, createDonor);
router.put('/:id', authMiddleware, updateDonor);
router.patch('/:id/availability', authMiddleware, toggleDonorAvailability);
router.delete('/:id', authMiddleware, deleteDonor);

export default router;
