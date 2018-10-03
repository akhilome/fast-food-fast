import { Router } from 'express';
import AuthHandler from '../middleware/authHandler';
import OrderController from '../controllers/orderController';
import Sanitize from '../middleware/sanitizer';

const router = new Router();

router.get('/users/:id/orders', AuthHandler.authorize, OrderController.getAllUserOrders);
router.post('/orders', AuthHandler.authorize, OrderController.newOrder);
router.get('/orders', AuthHandler.authorize, AuthHandler.authorizeAdmin, OrderController.getAllOrders);

router.get(
  '/orders/:id',
  AuthHandler.authorize,
  AuthHandler.authorizeAdmin,
  OrderController.getOrder,
);

router.put(
  '/orders/:id',
  AuthHandler.authorize,
  AuthHandler.authorizeAdmin,
  Sanitize.updateStatus,
  OrderController.updateOrder,
);

export default router;
