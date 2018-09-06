import express from 'express';
import orders from '../db/orders';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the fast food fast API!',
  });
});

router.get('/orders', (req, res) => {
  res.status(200).json({ orders });
});

export default router;
