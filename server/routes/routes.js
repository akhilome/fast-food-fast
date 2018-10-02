import express from 'express';
import OrderController from '../controllers/orderController';
import findOrder from '../middleware/findSingleOrder';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the fast food fast API!',
  });
});

router.get('/orders/:id', findOrder, OrderController.getOrder);
router.put('/orders/:id', findOrder, OrderController.updateOrder);

export default router;
