const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 * @param {string} id - User's MongoDB ObjectId
 * @returns {string} signed JWT
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

module.exports = generateToken;
