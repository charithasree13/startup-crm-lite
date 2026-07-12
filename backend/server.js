import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

// Database & utility configurations
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Initialize environment variables from .env file
dotenv.config();

/**
 * Validates that all required environment variables are present.
 * Exits immediately if critical settings are missing.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[FATAL ERROR] Missing required environment variables on boot: ${missing.join(', ')}`);
    process.exit(1);
  }
};

// Create Express application instance
const app = express();

// ---------------------------------------------------------------------------
// Security & Utility Middlewares
// ---------------------------------------------------------------------------

// 1. Helmet: set security-related HTTP headers to secure Express app
app.use(helmet());

/**
 * Helper function to recursively sanitize objects from MongoDB injection keys ($ and .)
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (!key.startsWith('$') && !key.includes('.')) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        clean[key] = sanitizeObject(obj[key]);
      } else {
        clean[key] = obj[key];
      }
    }
  }
  return clean;
};

// 2. Custom MongoDB query injection protection (compatible with Express 5 query getters)
app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    for (const key in req.query) {
      if (key.startsWith('$') || key.includes('.')) {
        delete req.query[key];
      } else if (typeof req.query[key] === 'object' && req.query[key] !== null) {
        req.query[key] = sanitizeObject(req.query[key]);
      }
    }
  }
  if (req.params) {
    for (const key in req.params) {
      if (key.startsWith('$') || key.includes('.')) {
        delete req.params[key];
      } else if (typeof req.params[key] === 'object' && req.params[key] !== null) {
        req.params[key] = sanitizeObject(req.params[key]);
      }
    }
  }
  next();
});

// 3. Dynamic HTTP Request Logging: production uses combined logs, dev uses colorized dev logs
const isProduction = process.env.NODE_ENV === 'production';
app.use(morgan(isProduction ? 'combined' : 'dev'));

// 4. CORS: Enable Cross-Origin Resource Sharing with dynamic origin checking
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
]
  .filter(Boolean)
  .flatMap(origin => {
    const trimmed = origin.replace(/\/$/, '');
    // If the origin doesn't start with a protocol, allow http, https, and the raw domain
    if (!/^https?:\/\//i.test(trimmed)) {
      return [`https://${trimmed}`, `http://${trimmed}`, trimmed];
    }
    return [trimmed];
  });

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow browser client requests with no origin header (like mobile apps, curl, postman)
      if (!origin) {
        callback(null, true);
        return;
      }
      const sanitizedOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(sanitizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// 5. Rate Limiting to prevent DOS and brute-force authentication attacks
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 register/login requests per window
  message: 'Too many auth attempts.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// 6. Request size parsing constraints to prevent DOS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ---------------------------------------------------------------------------
// Routes registration
// ---------------------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// App specific endpoints
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ---------------------------------------------------------------------------
// Error Handling
// ---------------------------------------------------------------------------

// The error handler middleware must be registered last, after routes
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Database Connection & Server Startup
// ---------------------------------------------------------------------------

let serverInstance;

const startServer = async () => {
  // 1. Validate environment configuration first
  checkRequiredEnvVars();

  // 2. Connect to Database first
  await connectDB();

  const PORT = process.env.PORT || 5000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // 3. Start listening for network requests
  serverInstance = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();

// ---------------------------------------------------------------------------
// Graceful Shutdown Handlers
// ---------------------------------------------------------------------------

const handleGracefulShutdown = async (signal) => {
  console.log(`\n[${signal}] Received. Starting graceful shutdown sequence...`);

  if (serverInstance) {
    serverInstance.close(() => {
      console.log('HTTP network server closed.');
    });
  }

  try {
    // Close MongoDB connection cleanly
    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly.');
    console.log('Server shutting down gracefully.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing connections during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

export default app;
