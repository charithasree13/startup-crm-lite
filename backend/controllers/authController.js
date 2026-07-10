import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * PRODUCTION NOTE ON RATE LIMITING:
 * 
 * For enterprise/production deployments, rate limiting must be configured
 * on auth endpoints to prevent brute-force attacks.
 * In a real production setup:
 * 
 * import rateLimit from 'express-rate-limit';
 * 
 * export const authLimiter = rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 5, // Limit each IP to 5 login/register requests per window
 *   message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
 * });
 * 
 * Add this middleware in authRoutes.js:
 * router.post('/login', authLimiter, login);
 * router.post('/register', authLimiter, register);
 */

/**
 * Generate a JWT for a specified User ID.
 *
 * @param {string} userId - Target User ID.
 * @returns {string} Signed JWT.
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Registers a new user.
 * Sends JWT token and user info on success.
 *
 * @async
 * @function register
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, username, mobile, role } = req.body;

    // 1. Double check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // Double check if username already exists
    if (username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return errorResponse(res, 'Username already exists', 409);
      }
    }

    // 2. Create and persist user (password hashing is handled by pre-save hook)
    const user = await User.create({
      name: name || username,
      username,
      mobile,
      email,
      password,
      role: role || 'admin',
    });

    // 3. Generate JWT access token
    const token = generateToken(user._id);

    // 4. Return standard 201 response. User details are filtered by User.toJSON()
    return successResponse(res, { token, user }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticates user credentials.
 * Returns JWT token and user details on successful verification.
 *
 * @async
 * @function login
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Look up user and explicitly include password field (excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 2. Validate password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 3. Prevent login if account is deactivated
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // 4. Generate JWT access token
    const token = generateToken(user._id);

    // 5. Send success response (toJSON overrides password removal)
    return successResponse(res, { token, user }, 'Logged in successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Returns currently authenticated user profile.
 *
 * @async
 * @function getProfile
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user has already been populated by the protect middleware
    return successResponse(res, req.user, 'Profile retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates authenticated user profile.
 * Allows updating display name and security credentials (password).
 *
 * @async
 * @function updateProfile
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Fetch user and explicitly select password to verify old password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // 1. Password update logic
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Old password is required to change password', 400);
      }

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Incorrect current password', 400);
      }

      user.password = newPassword;
    }

    // 2. Name update logic (email changes disallowed to maintain authentication integrity)
    if (name) {
      user.name = name;
    }

    // 3. Save modifications (pre-save hook hashes new password if modified)
    await user.save();

    // 4. Retrieve saved user instance without password field
    const updatedUser = await User.findById(user._id).select('-password');

    return successResponse(res, updatedUser, 'Profile updated successfully', 200);
  } catch (error) {
    next(error);
  }
};
