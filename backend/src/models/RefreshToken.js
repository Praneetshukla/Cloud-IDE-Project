const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * RefreshToken model for JWT refresh token rotation.
 *
 * Security design:
 * - Tokens are stored hashed (SHA-256) so they're useless if the DB is breached.
 * - Each token belongs to a "family" (lineage) for reuse detection.
 * - When a refresh token is reused, the entire family is revoked (session hijack signal).
 * - TTL index on expiresAt auto-purges expired tokens.
 */
const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    family: {
      type: String,
      required: true,
      index: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    userAgent: {
      type: String,
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-cleanup
refreshTokenSchema.index({ userId: 1, family: 1 });
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

// ─── Static Methods ───────────────────────────────────────────────

/**
 * Creates a new refresh token record with a hashed token.
 * @param {object} params - { rawToken, userId, family, userAgent, ipAddress, expiresAt }
 * @returns {Promise<object>} Created token document.
 */
refreshTokenSchema.statics.createToken = async function ({
  rawToken,
  userId,
  family,
  userAgent,
  ipAddress,
  expiresAt,
}) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  return this.create({
    token: hashedToken,
    userId,
    family: family || crypto.randomUUID(),
    userAgent,
    ipAddress,
    expiresAt,
  });
};

/**
 * Finds a valid (non-revoked, non-expired) token by its raw value.
 * @param {string} rawToken - Raw token string.
 * @returns {Promise<object|null>} Token document or null.
 */
refreshTokenSchema.statics.findByToken = async function (rawToken) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  return this.findOne({
    token: hashedToken,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });
};

/**
 * Revokes all tokens in a family (called on reuse detection).
 * @param {string} family - Token family ID.
 * @returns {Promise<object>} Update result.
 */
refreshTokenSchema.statics.revokeFamily = async function (family) {
  return this.updateMany({ family }, { isRevoked: true });
};

/**
 * Revokes all tokens for a user (logout from all devices).
 * @param {string} userId - User ID.
 * @returns {Promise<object>} Update result.
 */
refreshTokenSchema.statics.revokeAllForUser = async function (userId) {
  return this.updateMany({ userId }, { isRevoked: true });
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;
