const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const protect = (req, _res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication failed: No token provided', 401));
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Authentication failed: Invalid or expired token', 401));
  }
};

const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication failed: User identity missing', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Access denied: Admin privileges required to access this resource', 403)
      );
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
