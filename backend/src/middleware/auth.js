const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {resError} = require('../utils/response');

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

module.exports = {authenticate};

