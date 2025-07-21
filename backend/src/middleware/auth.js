const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { resError } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) return resError(res, 'Unauthorized: No token provided', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return resError(res, 'Unauthorized: User not found', 401);
    if (user.tokenVersion !== decoded.tokenVersion) {
      return resError(res, 'Unauthorized: Token is invalidated', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return resError(res, 'Invalid or expired token', 401);
  }
};


// Accepts one or more roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return resError(res, 'Access denied. Insufficient permission', 403);
    }
    next();
  };
};

module.exports = { authenticate, restrictTo };
