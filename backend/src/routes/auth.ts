import { Router } from 'express';
import { register, login, getCurrentUser, resetPassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getCurrentUser);
router.post('/reset-password', resetPassword);

export default router;
