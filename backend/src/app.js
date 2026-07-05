const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const globalErrorHandler = require('./middleware/error.middleware');
const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const configurePassport = require('./config/passport');
const configureCloudinary = require('./config/cloudinary');
const AppError = require('./utils/AppError');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Temporarily increased for testing (was 100)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

/**
 * Express application factory.
 * Configures all middleware, routes, and error handling.
 */
const createApp = () => {
  const app = express();

  // ─── Security Middleware ──────────────────────────────────────
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // ─── CORS ─────────────────────────────────────────────────────
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ─── Rate Limiting ────────────────────────────────────────────
  app.use('/api', generalLimiter);

  // ─── Body Parsers ─────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ─── Logging ──────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // ─── Passport (no sessions — JWT only) ────────────────────────
  app.use(passport.initialize());
  configurePassport();

  // ─── Cloudinary ───────────────────────────────────────────────
  configureCloudinary();

  // ─── API Routes ───────────────────────────────────────────────
  app.use('/api', routes);

  // ─── Root endpoint ────────────────────────────────────────────
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to Orbit Cloud IDE API',
      version: '1.0.0',
      docs: '/api/health',
    });
  });

  // ─── 404 Handler ──────────────────────────────────────────────
  app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server`, 404));
  });

  // ─── Global Error Handler ─────────────────────────────────────
  app.use(globalErrorHandler);

  return app;
};

module.exports = createApp;
