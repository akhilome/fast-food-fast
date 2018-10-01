import Validator from '../validators/validator';

class Sanitize {
  static signup(req, res, next) {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = req.body;

    const missingFields = [name, email, password, confirmPassword].map((field, index) => {
      const keys = {
        0: 'name',
        1: 'email',
        2: 'password',
        3: 'confirm password',
      };
      return field === undefined ? keys[index] : null;
    }).filter(field => field !== null).join(', ');

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: `you're missing these fields: ${missingFields}`,
      });
    }

    const response = message => res.status(400).json({ status: 'error', message });

    if (!Validator.isValidName(name)) return response('invalid name');
    if (!Validator.isEmail(email)) return response('invalid email');
    if (!Validator.isMatchingPasswords(password, confirmPassword)) return response('provided passwords donot match');
    if (!Validator.isValidPassword(password)) return response('invalid password');

    req.name = name.trim();
    req.email = email.trim();
    req.password = password.trim();
    return next();
  }

  static signin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'some required fields missing',
      });
    }

    if (!Validator.isEmail(email) || !Validator.isValidPassword(password)) {
      return res.status(400).json({
        status: 'error',
        message: 'email or password not correctly formatted',
      });
    }

    req.email = email.trim();
    req.password = password.trim();
    return next();
  }
}

export default Sanitize;
