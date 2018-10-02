import { Router } from 'express';
import AuthHandler from '../middleware/authHandler';
import OrderController from '../controllers/orderController';

const router = new Router();

router.get('/users/:id/orders', AuthHandler.authorize, OrderController.getAllUserOrders);
router.post('/orders', AuthHandler.authorize, OrderController.newOrder);
router.get('/orders', AuthHandler.authorize, AuthHandler.authorizeAdmin, OrderController.getAllOrders);
router.get('/orders/:id', AuthHandler.authorize, AuthHandler.authorizeAdmin, OrderController.getOrder);

export default router;
