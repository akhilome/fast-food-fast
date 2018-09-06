import orders from '../db/orders';

class OrderController {
  static getAllOrders(req, res) {
    res.status(200).json({ orders });
  }
}

export default OrderController;
