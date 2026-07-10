import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { LEAD_STATUSES, LEAD_SOURCES } from '../models/Lead.js';
import {
  getLeads,
  createLead,
  getLeadStats,
  getMonthlyStats,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  searchLeads
} from '../controllers/leadController.js';

const router = Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// ---------------------------------------------------------------------------
// Validation Rules
// ---------------------------------------------------------------------------

/**
 * Validation schema for Creating/Updating a Lead
 */
const leadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2 })
    .withMessage('Lead name must be at least 2 characters long'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  body('source')
    .optional()
    .isIn(LEAD_SOURCES)
    .withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),
];

/**
 * Validation schema for Patching Status
 */
const statusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
];

// ---------------------------------------------------------------------------
// Route Declarations (9 total endpoints mapped chronologically)
// ---------------------------------------------------------------------------

// Route 1: Get filtered, sorted, paginated leads owned by active user
router.get('/', getLeads);

// Route 2: Create a new lead owned by active user
router.post('/', validate(leadValidation), createLead);

// Route 3: Get aggregated pipeline statistics
router.get('/stats', getLeadStats);
router.get('/stats/summary', getLeadStats); // Alias for frontend compatibility

// Route 4: Get aggregated 6-month monthly trends
router.get('/monthly-stats', getMonthlyStats);
router.get('/stats/monthly', getMonthlyStats); // Alias for frontend compatibility

// Route for autocomplete search (must be placed before parameterized :id route)
router.get('/search', searchLeads);

// Route 5: Get a single lead by ID
router.get('/:id', getLeadById);

// Route 6: Update lead details by ID
router.put('/:id', validate(leadValidation), updateLead);

// Route 7: Quick status update by ID
router.patch('/:id/status', validate(statusValidation), updateLeadStatus);

// Route 8: Delete lead record by ID
router.delete('/:id', deleteLead);

export default router;
