import Validator from '../validators/validator';

/**
 * @class Sanitization middleware
 */
class Sanitize {
  /**
   * Santizes user signup requests
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static signup(req, res, next) {
    const {
      name,
      email,
      password,
      confirmPassword,
      adminSecret,
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
    req.adminSecret = adminSecret;
    return next();
  }

  /**
   * Sanitizes user email and provided password on every login request
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
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

  static updateStatus(req, res, next) {
    const { status } = req.body;

    if (
      status !== 'complete'
      && status !== 'processing'
      && status !== 'cancelled'
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'incorrect status type provided',
      });
    }

    req.status = status;

    return next();
  }

  /**
   * Sanitizes food name, food image url, and food price for add food requests
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static addFood(req, res, next) {
    const { foodName, foodImage, price } = req.body;

    if (!foodName || !price) {
      return res.status(400).json({
        status: 'error',
        message: 'you\'re missing some important fields',
      });
    }

    if (Number.isNaN(Number(price))) {
      return res.status(400).json({
        status: 'error',
        message: 'food price should be a number',
      });
    }

    req.foodName = foodName;
    req.foodImage = foodImage;
    req.price = price;
    return next();
  }

  /**
   * Sanitizes provided array of food ids when making a new order request
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async newOrder(req, res, next) {
    const { foodIds } = req.body;

    if (!foodIds
      || !Validator.isArray(foodIds)
      || !foodIds.length
      || !Validator.isArrayOfNumbers(foodIds)
    ) return res.status(400).json({ status: 'error', message: 'foodIds should be an array of numbers' });

    const { allFoodExists, allFoodItems } = await Validator.isArrayOfValidFoodIds(foodIds);
    if (!allFoodExists) {
      return res.status(404).json({
        status: 'error',
        message: 'one of the requested food items does not exist',
      });
    }
    // Create Array of requested food names.
    const foodItems = foodIds
      .map(foodId => allFoodItems.find(foodItem => foodItem.id === Number(foodId)).food_name);

    // Calculate total price of all requested food items
    const foodItemsTotalPrice = foodIds
      .map(foodId => allFoodItems.find(foodItem => foodItem.id === Number(foodId)).price)
      .reduce((accumulator, current) => accumulator + current);

    req.foodItems = foodItems;
    req.foodItemsTotalPrice = foodItemsTotalPrice;
    return next();
  }
}

export default Sanitize;
