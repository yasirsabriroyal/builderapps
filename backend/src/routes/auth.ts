import { Router } from 'express';
import { register, login, getCurrentUser, resetPassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRegister, validateLogin } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', authenticate, getCurrentUser);
router.post('/reset-password', authLimiter, resetPassword);

export default router;
