import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// ---------------------------------------------------------------------------
// Validation Rules
// ---------------------------------------------------------------------------

/**
 * Validation schema for User Registration
 */
const registerValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('mobile')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation schema for User Login
 */
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation schema for User Profile Update
 */
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('oldPassword')
    .optional()
    .notEmpty()
    .withMessage('Old password is required if changing password'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

// ---------------------------------------------------------------------------
// Routes Definitions (5 total routes supported including aliases)
// ---------------------------------------------------------------------------

// Route 1: Register a new user
router.post('/register', validate(registerValidation), register);

// Route 2: Authenticate and log in user
router.post('/login', validate(loginValidation), login);

// Route 3: Fetch active user profile
router.get('/profile', protect, getProfile);

// Route 4: Update active user profile
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

// Route 5: Profile alias '/me' to support alternative API consumer paths
router.get('/me', protect, getProfile);

export default router;
