import { Router } from 'express';
import AuthHandler from '../middleware/authHandler';
import MenuController from '../controllers/menuController';
import Sanitize from '../middleware/sanitizer';

const router = new Router();

router.get('/', MenuController.getMenu);
router.post(
  '/',
  AuthHandler.authorize,
  AuthHandler.authorizeAdmin,
  Sanitize.addFood,
  MenuController.addFood,
);
router.delete('/:id', AuthHandler.authorize, AuthHandler.authorizeAdmin, MenuController.deleteFood);

export default router;
