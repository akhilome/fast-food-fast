import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthHandler {
  static async generateAuthToken(req, res) {
    const {
      userId,
      userName,
      userEmail,
      userStatus,
    } = req;

    const token = jwt.sign({
      userId,
      userName,
      userEmail,
      userStatus,
    }, process.env.JWT_SECRET);

    res.status(200).json({
      status: 'success',
      message: 'user logged in successfully',
      auth_token: token,
    });
  }
}

export default AuthHandler;
