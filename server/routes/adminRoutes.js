import { Router } from 'express';
import { getStats, getUsers, getAllDonors, getAllBloodRequests } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/stats', authMiddleware, adminMiddleware, getStats);
router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.get('/donors', authMiddleware, adminMiddleware, getAllDonors);
router.get('/blood-requests', authMiddleware, adminMiddleware, getAllBloodRequests);

export default router;
