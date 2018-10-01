import { Router } from 'express';
import AuthHandler from '../middleware/authHandler';
import MenuController from '../controllers/menuController';

const router = new Router();

router.get('/', AuthHandler.authorize, MenuController.getMenu);

export default router;
