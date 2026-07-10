import mongoose from 'mongoose';

/**
 * @module models/Lead
 * @description Mongoose schema and model for sales leads.
 * Each lead is owned by a User and tracks its progress through
 * the CRM pipeline from "New" to "Won" or "Lost".
 */

const { Schema } = mongoose;

/**
 * Regex pattern for validating email addresses.
 * @see https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Allowed pipeline statuses — must match the values used on the frontend
 * to ensure consistent display and filtering.
 * @type {string[]}
 */
const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

/**
 * Allowed lead acquisition sources — must match the values used on the
 * frontend to keep analytics and filter dropdowns in sync.
 * @type {string[]}
 */
const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other',
];

/**
 * Lead Schema
 *
 * Represents a potential customer (sales lead) within the Startup CRM.
 * Tracks contact details, pipeline status, acquisition source, and
 * ownership. Includes a virtual `age` field for analytics.
 *
 * @typedef {Object} LeadSchema
 */
const leadSchema = new Schema(
  {
    /**
     * Full name of the lead / contact person.
     * This is the primary identifier shown in list views and detail pages.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters long'],
      maxlength: [100, 'Lead name must be at most 100 characters long'],
    },

    /**
     * Company or organisation the lead is associated with.
     * Used for grouping and company-level pipeline views.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    /**
     * Professional email address of the lead.
     * Used for outreach communications and as a secondary unique identifier.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      validate: {
        validator: (value) => EMAIL_REGEX.test(value),
        message: 'Email must be a valid email address',
      },
    },

    /**
     * Phone number of the lead (optional).
     * Stored as a free-form string to accommodate international formats.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true,
      default: undefined,
    },

    /**
     * Current position of the lead in the sales pipeline.
     * Values correspond 1-to-1 with the frontend status badges:
     * 'New' → 'Contacted' → 'Meeting Scheduled' → 'Proposal Sent' → 'Won' | 'Lost'
     * @type {String}
     * @default 'New'
     */
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message:
          'Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost',
      },
      default: 'New',
    },

    /**
     * Channel through which the lead was acquired.
     * Drives attribution analytics on the dashboard.
     * @type {String}
     * @default 'Website'
     */
    source: {
      type: String,
      enum: {
        values: LEAD_SOURCES,
        message:
          'Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other',
      },
      default: 'Website',
    },

    /**
     * Free-form notes about the lead (optional).
     * Sales reps can record call summaries, follow-up reminders, etc.
     * Capped at 1 000 characters to keep documents lean.
     * @type {String}
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes must be at most 1000 characters long'],
      default: undefined,
    },

    /**
     * Reference to the User who created / owns this lead.
     * Used for access-control scoping — users should only see their own leads
     * unless they have an admin role.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead must have an owner'],
    },
  },
  {
    /**
     * Mongoose `timestamps` option — automatically manages
     * `createdAt` and `updatedAt` fields on every document.
     */
    timestamps: true,

    /**
     * Enable virtuals in JSON and Object serialisation so that
     * the computed `age` field is included in API responses.
     */
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------------------------------------------------------------------------
// Virtual Fields
// ---------------------------------------------------------------------------

/**
 * Virtual: age
 *
 * Returns the number of whole days since the lead was created.
 * Useful for sales-velocity analytics, stale-lead detection, and
 * dashboard KPIs.
 *
 * @returns {number} Age of the lead in days (integer, rounded down).
 * @example
 *   const lead = await Lead.findById(id);
 *   console.log(`Lead is ${lead.age} days old`);
 */
leadSchema.virtual('age').get(function getAge() {
  if (!this.createdAt) return 0;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((Date.now() - this.createdAt.getTime()) / msPerDay);
});

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

/**
 * Compound index on (owner, status).
 * Optimises the most common query pattern: "fetch all leads for a given
 * user filtered by pipeline status".
 */
leadSchema.index({ owner: 1, status: 1 });

/**
 * Single-field index on email.
 * Speeds up duplicate-check lookups and search-by-email queries.
 */
leadSchema.index({ email: 1 });

/**
 * Compound index on (owner, createdAt).
 * Optimises default sorting, pagination, and date range query filters.
 */
leadSchema.index({ owner: 1, createdAt: -1 });

/**
 * Compound index on (owner, status, createdAt).
 * Optimises status-filtered lists sorted chronologically.
 */
leadSchema.index({ owner: 1, status: 1, createdAt: -1 });

/**
 * Compound index on (owner, source).
 * Optimises source analytics grouping.
 */
leadSchema.index({ owner: 1, source: 1 });

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/** @type {mongoose.Model} Compiled Mongoose model for the Lead collection. */
const Lead = mongoose.model('Lead', leadSchema);

export { leadSchema, LEAD_STATUSES, LEAD_SOURCES };
export default Lead;
