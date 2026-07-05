const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT.
 * @param {string} id - User's MongoDB _id
 * @param {boolean} rememberMe - If true, extends expiry to 30 days
 * @returns {string} Signed JWT
 */
const generateToken = (id, rememberMe = false) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? '30d' : process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify a JWT and return the decoded payload.
 * @param {string} token
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
