import pool from '../db/config';

/**
 * @class Validation Class
 */
class Validator {
  /**
   * Check if provided email has a valid email address formatting
   * @param {string} email - email address to be validated
   * @returns {boolean} - true is email is properly formatted, false if otherwise
   */
  static isEmail(email) {
    const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/ig;
    return re.test(email.trim().toLowerCase());
  }

  /**
   * Check if provided password meets the minimum secure password requirement
   * @param {string} password - password to be validated
   * @returns {boolean} - true if password meets minimum complexity requirements
   */
  static isValidPassword(password) {
    return password.trim().length > 5;
  }

  /**
   * Check if the two provided passwords match
   * @param {string} password - first password provided
   * @param {string} confirmPassword - second provided password
   * @returns {boolean} - true if both passwords match, false if otherwise
   */
  static isMatchingPasswords(password, confirmPassword) {
    return password.trim() === confirmPassword.trim();
  }

  /**
   * Check if name provided is ok
   * @param {string} name - the name to be validated
   * @returns {boolean} - true if the name provided meets the minimum acceptance criteria
   */
  static isValidName(name) {
    return name.trim().length >= 2;
  }

  /**
   * Check if provided argument is a valid array
   * @param {Object[]} value
   * @returns {boolean} - true if the provided value is an array
   */
  static isArray(value) {
    return Array.isArray(value);
  }

  /**
   * Check if the provided array is one which contains only numbers
   * @param {Object[]} array - array of food ids to buy
   * @returns {boolean} - true if all the elements in the provided array are numbers
   */
  static isArrayOfNumbers(array) {
    return array.every(element => !Number.isNaN(Number(element)));
  }

  /**
   * Check db if all food ids to be purchase actually exist.
   * @param {Object[]} foodIds - arrays of food ids to place an order for
   * @returns {boolean} - true if all the food ids in the provided array all exist in the database
   */
  static async isArrayOfValidFoodIds(foodIds) {
    try {
      const allFoodItems = (await pool.query('SELECT * FROM menu')).rows;
      const validFoodIds = allFoodItems.map(food => food.id);
      return {
        allFoodExists: foodIds.every(foodId => validFoodIds.includes(Number(foodId))),
        allFoodItems,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

/* Refs.
  email regex pattern credit: https://www.regular-expressions.info/email.html?wlr=1
*/

export default Validator;
