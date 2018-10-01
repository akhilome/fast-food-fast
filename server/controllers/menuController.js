import pool from '../db/config';

class MenuController {
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
}

export default MenuController;
