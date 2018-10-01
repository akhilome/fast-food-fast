import { Router } from 'express';
import AuthController from '../controllers/authController';
import Sanitize from '../middleware/sanitizer';
import AuthHandler from '../middleware/authHandler';

const router = new Router();

router.post('/signup', Sanitize.signup, AuthController.signup);
router.post('/login', Sanitize.signin, AuthController.signin, AuthHandler.generateAuthToken);

export default router;
