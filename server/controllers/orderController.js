import orders from '../db/orders';

class OrderController {
  static getAllOrders(req, res) {
    res.status(200).json({ orders });
  }

  static getOrder(req, res) {
    const { order } = req;

    if (!order) {
      return res.status(404).json({
        error: 'That order doesn\'t exist',
      });
    }

    return res.status(200).json(order);
  }
}

export default OrderController;
