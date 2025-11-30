const jwt = require('jsonwebtoken');

/**
 * Generate JWT access and refresh tokens
 * @param {string} id - User ID
 * @returns {object} Object containing accessToken and refreshToken
 */
const generateToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // 15 minutes
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d', // 7 days
  });

  return { accessToken, refreshToken };
};

module.exports = generateToken;
