import { Router } from 'express';
import { getMyDonations, createDonation } from '../controllers/donationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getMyDonations);
router.post('/', authMiddleware, createDonation);

export default router;
