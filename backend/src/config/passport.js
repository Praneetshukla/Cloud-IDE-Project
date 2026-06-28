const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const { AUTH_PROVIDERS } = require('../utils/constants');

/**
 * Configures Passport.js OAuth strategies.
 * We don't use Passport sessions — we issue JWTs after OAuth callback.
 * The strategies find-or-create users and handle account linking
 * (if a user with the same email already exists).
 */
const configurePassport = () => {
  // ─── Google OAuth 2.0 Strategy ────────────────────────────────
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null;

            // Try to find user by Google ID first
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
              // Existing Google user — update last login
              user.lastLogin = Date.now();
              await user.save({ validateBeforeSave: false });
              return done(null, user);
            }

            // Check if a user with the same email already exists (account linking)
            if (email) {
              user = await User.findOne({ email });
              if (user) {
                // Link Google account to existing user
                user.googleId = profile.id;
                user.isEmailVerified = true; // Google verifies emails
                user.lastLogin = Date.now();
                if (!user.avatar && profile.photos && profile.photos.length > 0) {
                  user.avatar = profile.photos[0].value;
                }
                await user.save({ validateBeforeSave: false });
                return done(null, user);
              }
            }

            // Create new user from Google profile
            const newUser = await User.create({
              name: profile.displayName || 'Google User',
              email,
              googleId: profile.id,
              authProvider: AUTH_PROVIDERS.GOOGLE,
              avatar:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : undefined,
              isEmailVerified: true,
              lastLogin: Date.now(),
            });

            return done(null, newUser);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
  }

  // ─── GitHub OAuth 2.0 Strategy ────────────────────────────────
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL,
          scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null;

            // Try to find user by GitHub ID first
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
              user.lastLogin = Date.now();
              await user.save({ validateBeforeSave: false });
              return done(null, user);
            }

            // Account linking — check if email already exists
            if (email) {
              user = await User.findOne({ email });
              if (user) {
                user.githubId = profile.id;
                user.isEmailVerified = true;
                user.lastLogin = Date.now();
                if (
                  !user.avatar &&
                  profile.photos &&
                  profile.photos.length > 0
                ) {
                  user.avatar = profile.photos[0].value;
                }
                await user.save({ validateBeforeSave: false });
                return done(null, user);
              }
            }

            // Create new user from GitHub profile
            const newUser = await User.create({
              name:
                profile.displayName || profile.username || 'GitHub User',
              email,
              githubId: profile.id,
              authProvider: AUTH_PROVIDERS.GITHUB,
              avatar:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : undefined,
              isEmailVerified: true,
              lastLogin: Date.now(),
            });

            return done(null, newUser);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
  }

  // No serialize/deserialize — we use stateless JWTs, not sessions
};

module.exports = configurePassport;
