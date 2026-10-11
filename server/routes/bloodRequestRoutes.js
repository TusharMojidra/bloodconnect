import { Router } from 'express';
import {
  getBloodRequests,
  createBloodRequest,
  updateBloodRequest,
  deleteBloodRequest,
  getMyBloodRequests,
} from '../controllers/bloodRequestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getBloodRequests);
router.get('/me', authMiddleware, getMyBloodRequests);
router.post('/', authMiddleware, createBloodRequest);
router.put('/:id', authMiddleware, updateBloodRequest);
router.delete('/:id', authMiddleware, deleteBloodRequest);

export default router;
