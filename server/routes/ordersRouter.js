import { Router } from 'express';
import AuthHandler from '../middleware/authHandler';
import OrderController from '../controllers/orderController';

const router = new Router();

router.get('/users/:id/orders', AuthHandler.authorize, OrderController.getAllUserOrders);
router.post('/orders', AuthHandler.authorize, OrderController.newOrder);

export default router;
