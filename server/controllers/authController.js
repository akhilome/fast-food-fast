import bcrpyt from 'bcryptjs';
import pool from '../db/config';

class AuthController {
  static async signup(req, res, next) {
    const {
      name,
      email,
      password,
      adminSecret,
    } = req;
    const isAdmin = adminSecret === process.env.ADMIN_SECRET ? 't' : 'f';

    try {
      // Check if a user with the provided email already exists
      const existingUser = (await pool.query('SELECT * FROM users WHERE email=$1', [email])).rowCount;
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'a user with that email already exists',
        });
      }
      // Hash password and save user to database
      const hashedPassword = await bcrpyt.hash(password, 10);
      const dbQuery = 'INSERT INTO users(name, email, password, is_admin) VALUES($1, $2, $3, $4)';
      await pool.query(dbQuery, [name, email, hashedPassword, isAdmin]);
      return next();
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  static async signin(req, res, next) {
    const { email, password } = req;
    const errResponse = {
      status: 'error',
      message: 'invalid email or password provided',
    };

    try {
      // Check if a user with the provided email exists
      const userExists = (await pool.query('SELECT * FROM users WHERE email=$1', [email])).rowCount;

      if (!userExists) return res.status(400).json(errResponse);

      const userDetails = (await pool.query('SELECT * FROM users WHERE email=$1', [email])).rows[0];
      const correctPassword = await bcrpyt.compare(password, userDetails.password);

      if (!correctPassword) return res.status(400).json(errResponse);

      // Append important payload to request object
      req.userId = userDetails.id;
      req.userName = userDetails.name;
      req.userEmail = userDetails.email;
      req.userStatus = userDetails.is_admin ? 'admin' : 'customer';
      return next();
    } catch (error) {
      return res.status(500).json();
    }
  }
}

export default AuthController;
