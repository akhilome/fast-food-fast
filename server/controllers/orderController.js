import pool from '../db/config';
import orderFormatter from '../middleware/formatter';

/**
 * @class Order Controller
 */
class OrderController {
  /**
   * Get all placed orders
   * @param {*} req
   * @param {*} res
   * @returns {Object} - response object containing the status of the
   * request and all user orders, if any
   */
  static async getAllOrders(req, res) {
    try {
      const dbQuery = 'SELECT orders.id, orders.items, orders.price, users.name, orders.date, orders.status FROM orders JOIN users ON orders.author = users.id';
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

  /**
   * Get the details of a single order
   * @param {*} req
   * @param {*} res
   * @returns {Object}
   */
  static async getOrder(req, res) {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ status: 'error', message: 'invalid order id format' });
    }

    try {
      const allOrders = (await pool.query(
        'SELECT orders.id, orders.items, orders.price, users.name, orders.date, orders.status FROM orders JOIN users ON orders.author = users.id',
      )).rows;

      const formattedOrders = orderFormatter(allOrders);
      const targetOrder = formattedOrders.find(order => order.id === Number(id));

      if (!targetOrder) return res.status(404).json({ status: 'error', message: 'no such order exists' });

      return res.status(200).json({
        status: 'success',
        message: 'order fetched successfully',
        order: targetOrder,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  /**
   * place a new order to the API
   * @param {*} req
   * @param {*} res
   * @returns {Object}
   */
  static async newOrder(req, res) {
    const { foodItems, foodItemsTotalPrice } = req;

    const dbInsertQuery = 'INSERT INTO orders(items, price, author) VALUES($1, $2, $3)';
    const dbSelectQuery = 'SELECT orders.id, orders.items, orders.price, users.name, orders.date, orders.status FROM orders JOIN users ON orders.author = users.id';

    try {
      await pool.query(dbInsertQuery, [JSON.stringify(foodItems), foodItemsTotalPrice, req.userId]);
      const allOrders = await pool.query(dbSelectQuery);
      const newOrder = orderFormatter(allOrders.rows)[allOrders.rowCount - 1];

      return res.status(201).json({
        status: 'success',
        message: 'new order placed successfully',
        order: newOrder,
      });
    } catch (error) {
      return res.status(500).json();
    }
  }

  /**
   * update the status of an order
   * @param {*} req
   * @param {*} res
   * @returns {Object}
   */
  static async updateOrder(req, res) {
    const { id } = req.params;
    if (!Number(id)) return res.status(400).json({ status: 'error', message: 'invalid order id provided' });

    try {
      const orderExists = (await pool.query('SELECT * FROM orders WHERE id=$1', [Number(id)]))
        .rowCount;
      if (!orderExists) return res.status(404).json({ status: 'error', message: 'no order with that id exists' });

      await pool.query('UPDATE orders SET status=$1 WHERE id=$2', [req.status, Number(id)]);
      const updatedOrders = (await pool.query(
        'SELECT orders.id, orders.items, orders.price, users.name, orders.date, orders.status FROM orders JOIN users ON orders.author = users.id',
      )).rows;

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

  /**
   * get the all orders placed by all users
   * @param {*} req
   * @param {*} res
   * @returns {Object}
   */
  static async getAllUserOrders(req, res) {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) return res.status(400).json({ status: 'error', message: 'invalid user id' });

    if (Number(id) !== req.userId) {
      return res.status(403).json({
        status: 'error',
        message: "you're not allowed to do that",
      });
    }

    try {
      const userOrders = (await pool.query('SELECT * FROM orders WHERE author=$1', [id])).rows;
      const formattedUserOrders = userOrders.map(order => ({
        id: order.id,
        items: JSON.parse(order.items),
        price: order.price,
        date: order.date,
        status: order.status,
      }));
      return res.status(200).json({
        status: 'success',
        message: 'orders fetched successfully',
        orders: formattedUserOrders,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default OrderController;
