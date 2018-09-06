import express from 'express';
import OrderController from '../controllers/orderController';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the fast food fast API!',
  });
});

router.get('/orders', OrderController.getAllOrders);

export default router;
