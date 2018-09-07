import orders from '../db/orders';
import Order from '../models/Order';

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

  static newOrder(req, res) {
    const { author, title } = req.body;
    if (!author || !title) {
      return res.status(400).json({
        error: 'incomplete data',
      });
    }

    const order = new Order(orders.length + 1, author, title);
    orders.push(order);
    return res.status(201).json({
      message: 'order placed',
      order,
    });
  }
}

export default OrderController;
