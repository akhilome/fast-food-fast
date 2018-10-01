import orders from '../db/orders';
import Order from '../models/Order';
import pool from '../db/config';

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

  static updateOrder(req, res) {
    const { orderIndex } = req;
    const { status } = req.body;

    if (orderIndex === -1) {
      return res.status(404).json({
        error: 'no such order exists',
      });
    }

    if (!status) {
      return res.status(400).json({
        error: 'no new status specified',
      });
    }

    orders[orderIndex].status = status;
    return res.status(201).json({
      message: 'order status updated successfully',
      order: orders[orderIndex],
    });
  }

  static async getAllUserOrders(req, res) {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({
        status: 'error',
        message: 'invalid user id',
      });
    }

    if (Number(id) !== req.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'you\'re not allowed to do that',
      });
    }

    try {
      const userOrders = (await pool.query('SELECT * FROM orders WHERE author=$1', [id])).rows;
      return res.status(200).json({
        status: 'success',
        message: 'orders fetched successfully',
        orders: userOrders,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default OrderController;
