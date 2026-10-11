import { Router } from 'express';
import { signup, login, getMe, updateProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);

export default router;
