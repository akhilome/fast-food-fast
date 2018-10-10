import pool from '../db/config';
import orderFormatter from '../middleware/formatter';

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const dbQuery = 'SELECT orders.id, menu.food_name, users.name, orders.date, orders.status FROM orders JOIN menu ON orders.item = menu.id JOIN users ON orders.author = users.id';
      const allOrders = (await pool.query(dbQuery)).rows;
      const formattedOrders = orderFormatter(allOrders);

      res.status(200).json({
        status: 'success',
        message: 'orders fetched successfully',
        orders: formattedOrders,
      });
    } catch (error) {
      res.status(500).json();
    }
  }

  static async getOrder(req, res) {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({
        status: 'error',
        message: 'invalid order id format',
      });
    }

    try {
      const allOrders = (await pool.query('SELECT orders.id, menu.food_name, users.name, orders.date, orders.status FROM orders JOIN menu ON orders.item = menu.id JOIN users ON orders.author = users.id')).rows;

      const formattedOrders = orderFormatter(allOrders);
      const targetOrder = formattedOrders.find(order => order.id === Number(id));

      if (!targetOrder) {
        return res.status(404).json({
          status: 'error',
          message: 'no such order exists',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'order fetched successfully',
        order: targetOrder,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async newOrder(req, res) {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({
        status: 'error',
        message: 'incomplete data',
      });
    }

    if (Number.isNaN(Number(foodId))) {
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
      res.status(500).json(error);
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

  static async updateOrder(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'invalid order id provided',
      });
    }

    try {
      const dbQuery = 'UPDATE orders SET status=$1 WHERE id=$2';
      await pool.query(dbQuery, [req.status, Number(id)]);

      const orderExists = (await pool.query('SELECT * FROM orders WHERE id=$1', [Number(id)])).rowCount;

      if (!orderExists) {
        return res.status(404).json({
          status: 'error',
          message: 'no order with that id exists',
        });
      }

      const updatedOrders = (await pool.query('SELECT orders.id, menu.food_name, users.name, orders.date, orders.status FROM orders JOIN menu ON orders.item = menu.id JOIN users ON orders.author = users.id')).rows;

      const formattedOrders = orderFormatter(updatedOrders);
      const targetOrder = formattedOrders.find(order => order.id === Number(id));
      return res.status(200).json({
        status: 'success',
        message: 'order status updated successfully',
        order: targetOrder,
      });
    } catch (error) {
      return res.status(500).json();
    }
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
