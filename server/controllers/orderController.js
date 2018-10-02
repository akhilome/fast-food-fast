import orders from '../db/orders';
import pool from '../db/config';

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const dbQuery = 'SELECT orders.id, menu.food_name, users.name, orders.date, orders.status FROM orders JOIN menu ON orders.item = menu.id JOIN users ON orders.author = users.id';
      const allOrders = (await pool.query(dbQuery)).rows;

      const userOrders = allOrders.map((order) => {
        const formattedOrder = {
          id: order.id,
          author: order.name,
          title: order.food_name,
          date: order.date,
          status: order.status,
        };

        return formattedOrder;
      });

      res.status(200).json({
        status: 'success',
        message: 'orders fetched successfully',
        orders: userOrders,
      });
    } catch (error) {
      res.status(500).json();
    }
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

  static async newOrder(req, res) {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({
        status: 'error',
        message: 'incomplete data',
      });
    }

    if (typeof foodId !== 'number') {
      return res.status(400).json({
        status: 'error',
        message: 'invalid data provided',
      });
    }
    try {
      const foodExists = (await pool.query('SELECT * FROM menu WHERE id=$1', [foodId])).rowCount;

      if (!foodExists) {
        return res.status(400).json({
          status: 'error',
          message: 'no such food exists',
        });
      }
    } catch (error) {
      res.status(500).json();
    }

    const dbInsertQuery = 'INSERT INTO orders(item, author) VALUES($1, $2)';
    const dbSelectQuery = 'SELECT orders.id, menu.food_name, users.name, orders.date, orders.status FROM orders JOIN menu ON orders.item = menu.id JOIN users ON orders.author = users.id';

    try {
      await pool.query(dbInsertQuery, [foodId, req.userId]);
      const allOrders = (await pool.query(dbSelectQuery));
      const newOrder = allOrders.rows[allOrders.rowCount - 1];

      return res.status(201).json({
        status: 'success',
        message: 'new order placed successfully',
        order: {
          id: newOrder.id,
          author: newOrder.name,
          title: newOrder.food_name,
          date: newOrder.date,
          status: newOrder.status,
        },
      });
    } catch (error) {
      return res.status(500).json();
    }
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
