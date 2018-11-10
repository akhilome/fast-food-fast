import pool from '../db/config';

/**
 * @class Menu Controller
 */
class MenuController {
  /**
   * handles fetching all available food items from the database
   * @param {*} req
   * @param {*} res
   * @returns {Object}
   */
  static async getMenu(req, res) {
    try {
      const menu = (await pool.query('SELECT * FROM menu')).rows;

      res.status(200).json({
        status: 'success',
        message: 'menu fetched successfully',
        menu,
      });
    } catch (error) {
      res.status(500).json();
    }
  }

  /**
   * hanldes adding new food items to the database
   * @param {*} req
   * @param {*} res
   * @returns {Object}
   */
  static async addFood(req, res) {
    const { foodName, foodImage, price } = req;
    try {
      const insertQuery = 'INSERT INTO menu(food_name, food_image, price) VALUES($1, $2, $3) RETURNING *';
      const newFood = (await pool.query(insertQuery, [foodName, foodImage, price])).rows[0];

      res.status(201).json({
        status: 'success',
        message: 'new food added successfully',
        food: newFood,
      });
    } catch (error) {
      res.status(500).json();
    }
  }

  /**
   * hnadles the removal of food items from the database
   * @param {*} req
   * @param {*} res
   * @returns {Object}
   */
  static async deleteFood(req, res) {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      res.status(400).json({ status: 'error', message: 'invalid id type' });
      return;
    }

    try {
      const dbQuery = 'DELETE FROM menu WHERE id=$1 RETURNING *';
      const deletedFood = (await pool.query(dbQuery, [Number(id)])).rows[0];

      if (!deletedFood) {
        res.status(404).json({
          status: 'error',
          message: 'no such food exists',
        });
      } else {
        res.status(200).json({
          status: 'success',
          message: 'food item sucessfully removed from menu',
        });
      }
    } catch (error) {
      res.status(500).json();
    }
  }
}

export default MenuController;
