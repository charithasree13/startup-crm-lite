import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @module models/User
 * @description Mongoose schema and model for application users.
 * Handles authentication-related concerns: password hashing,
 * password comparison, and JSON sanitisation.
 */

const { Schema } = mongoose;

/** Number of salt rounds used by bcrypt for password hashing. */
const SALT_ROUNDS = 10;

/**
 * Regex pattern for validating email addresses.
 * Matches standard email formats: local-part@domain.tld
 * @see https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * User Schema
 *
 * Represents an authenticated user of the Startup CRM application.
 * Users can be either administrators or regular users, and each user
 * owns zero or more leads.
 *
 * @typedef {Object} UserSchema
 */
const userSchema = new Schema(
  {
    /**
     * Full display name of the user.
     * Shown throughout the UI and used in email greetings.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name must be at most 50 characters long'],
    },

    /**
     * User's unique handle / username.
     * Sparse allows indexing documents without usernames (e.g. existing records)
     * without triggering unique key constraints.
     * @type {String}
     */
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      sparse: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },

    /**
     * User's mobile number.
     * @type {String}
     */
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },

    /**
     * User's email address — serves as the login identifier.
     * Stored in lowercase for case-insensitive lookups.
     * Must be unique across the entire collection.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => EMAIL_REGEX.test(value),
        message: 'Email must be a valid email address',
      },
    },

    /**
     * Hashed password for the user account.
     * Plain-text passwords are automatically hashed via a pre-save hook
     * using bcryptjs with 10 salt rounds — the raw value is never persisted.
     * @type {String}
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },

    /**
     * User's role within the application, controlling access levels.
     * - 'admin' — full access to all CRM resources and settings.
     * - 'user'  — standard access scoped to own resources.
     * @type {String}
     * @default 'user'
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either "admin" or "user"',
      },
      default: 'user',
    },

    /**
     * Soft-delete / deactivation flag.
     * When set to `false`, the user is considered deactivated and
     * should be denied access at the authentication layer.
     * @type {Boolean}
     * @default true
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    /**
     * Mongoose `timestamps` option — automatically manages
     * `createdAt` and `updatedAt` fields on every document.
     */
    timestamps: true,
  }
);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

/**
 * Pre-save hook — hashes the password whenever it has been modified.
 *
 * Uses bcryptjs with a cost factor of 10. The hook is intentionally
 * written as a regular function (not an arrow function) so that `this`
 * correctly refers to the document being saved.
 */
userSchema.pre('save', async function preSaveHashPassword() {
  // Only hash when the password field has actually changed.
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

// ---------------------------------------------------------------------------
// Instance Methods
// ---------------------------------------------------------------------------

/**
 * Compare a candidate (plain-text) password against the stored hash.
 *
 * @param   {string}  candidatePassword  The plain-text password to verify.
 * @returns {Promise<boolean>}           Resolves to `true` if the passwords
 *                                       match, `false` otherwise.
 * @example
 *   const user = await User.findOne({ email });
 *   const isMatch = await user.comparePassword(loginPassword);
 */
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ---------------------------------------------------------------------------
// JSON Serialisation
// ---------------------------------------------------------------------------

/**
 * Customise the JSON representation of a User document.
 *
 * Strips the `password` field so that hashed passwords are never
 * accidentally leaked through API responses or logging.
 *
 * @returns {Object} A plain object without the password field.
 */
userSchema.methods.toJSON = function toJSON() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/** @type {mongoose.Model} Compiled Mongoose model for the User collection. */
const User = mongoose.model('User', userSchema);

export { userSchema };
export default User;
