import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express Error Handling Middleware.
 * Intercepts all unhandled errors thrown inside route handlers and controllers.
 * Standardizes MongoDB/Mongoose, JWT, and generic system errors.
 *
 * @param {Object} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Sends HTTP response directly.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // Clone name for matching, as sometimes it gets overridden
  const errorName = err.name;
  const errorCode = err.code;

  // 1. Mongoose Validation Error (HTTP 400 Bad Request)
  if (errorName === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = {};
    // Extract individual field validation messages
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }
  
  // 2. Mongoose Cast Error e.g. invalid ObjectId (HTTP 404 Not Found)
  else if (errorName === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
    errors = {
      path: err.path,
      value: err.value,
      message: `Invalid value for field: ${err.path}`,
    };
  }

  // 3. MongoDB Duplicate Key Error (HTTP 409 Conflict)
  else if (errorCode === 11000) {
    statusCode = 409;
    message = 'Email already exists';
    // If the index name or keyPattern is not email, we can keep the instruction's message
    errors = err.keyPattern || null;
  }

  // 4. JWT Error (HTTP 401 Unauthorized)
  else if (errorName === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  // 5. JWT Expired Error (HTTP 401 Unauthorized)
  else if (errorName === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Log errors during development
  if (process.env.NODE_ENV !== 'production') {
    console.error('--- [Error Logged in Handler] ---');
    console.error(err);
  }

  // Construct response payload
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(isDevelopment && { stack: err.stack }),
  });
};

export default errorHandler;
