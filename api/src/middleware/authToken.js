require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_secret = process.env.JWT_secret;

/**
 * Verifies the JWT token and attaches decoded payload to req.user.
 * Does NOT restrict by role or user id — use this for general authenticated routes.
 */
const authToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, JWT_secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authToken;
