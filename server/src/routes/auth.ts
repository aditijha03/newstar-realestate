import { Router } from 'express';
import { login, logout, me } from '../controllers/auth';
import { validateLogin } from '../validators/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me as any);

export default router;
