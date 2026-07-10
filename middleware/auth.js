import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authentication Guardian Middleware.
 * Protects routes by verifying the presence, authenticity, and validity
 * of the JSON Web Token (JWT) supplied in the Authorization header.
 * Attaches the authenticated user object to the request object.
 *
 * @async
 * @function protect
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for authorization header and extract token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Return 401 if token is missing
  if (!token) {
    return errorResponse(res, 'No token provided, access denied', 401);
  }

  try {
    // 3. Verify JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Retrieve database user reference and exclude password field
    const user = await User.findById(decoded.id).select('-password');

    // 5. Verify user still exists in system
    if (!user) {
      return errorResponse(
        res,
        'User belonging to this token no longer exists',
        401
      );
    }

    // 6. Ensure user account is active
    if (!user.isActive) {
      return errorResponse(
        res,
        'User account is deactivated',
        403
      );
    }

    // 7. Attach validated user to the request object and proceed
    req.user = user;
    next();
  } catch (error) {
    // Handle expired token
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired, please login again', 401);
    }

    // Handle malformed/tampered JWT
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token is invalid', 401);
    }

    // Pass unexpected internal/database errors to global handler
    next(error);
  }
};
