import { Router } from 'express';
import AuthController from '../controllers/authController';
import Sanitize from '../middleware/sanitizer';

const router = new Router();
router.post('/signup', Sanitize.signup, AuthController.signup);

export default router;
