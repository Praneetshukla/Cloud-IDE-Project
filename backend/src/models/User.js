const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
  ROLES,
  AUTH_PROVIDERS,
  BCRYPT_SALT_ROUNDS,
  TOKEN_EXPIRY,
} = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never returned in queries by default
    },

    avatar: {
      type: String,
      default: null,
    },

    avatarPublicId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.LOCAL,
    },

    googleId: {
      type: String,
      sparse: true,
      default: null,
    },

    githubId: {
      type: String,
      sparse: true,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// ─── Pre-save: Hash password ──────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password is modified (or new)
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);

  // Record password change time (for JWT invalidation)
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // 1s buffer for JWT timing
  }

  next();
});

// ─── Pre-query: Exclude inactive users ────────────────────────────
userSchema.pre(/^find/, function (next) {
  // Only apply this filter if not explicitly querying inactive users
  if (this.getOptions().includeInactive) {
    return next();
  }
  this.find({ isActive: { $ne: false } });
  next();
});

// ─── Instance Methods ─────────────────────────────────────────────

/**
 * Compares candidate password against stored hash.
 * @param {string} candidatePassword - Plain text password to check.
 * @returns {Promise<boolean>} True if passwords match.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Checks if password was changed after a JWT was issued.
 * @param {number} jwtTimestamp - JWT iat timestamp (in seconds).
 * @returns {boolean} True if password was changed after token was issued.
 */
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

/**
 * Generates a password reset token with 10-minute expiry.
 * The raw token is sent via email; the hashed version is stored in the DB.
 * @returns {string} Raw unhashed token for email.
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + TOKEN_EXPIRY.PASSWORD_RESET;

  return resetToken;
};

/**
 * Generates an email verification token with 24-hour expiry.
 * @returns {string} Raw unhashed token for email.
 */
userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.emailVerificationExpires =
    Date.now() + TOKEN_EXPIRY.EMAIL_VERIFICATION;

  return verificationToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
