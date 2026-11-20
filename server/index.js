import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { initDatabase } from './db/init.js';
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customer.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy for rate limiting behind reverse proxies / Vite
app.set('trust proxy', 1);

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development and same-origin requests
      callback(null, true);
    },
    credentials: true,
  })
);

// Parsers
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static assets (certificates, resources, images) from public folder
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.use('/certificates', express.static(path.join(publicPath, 'certificates')));
app.use('/resources', express.static(path.join(publicPath, 'resources')));

// Rate limiting on sensitive auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || '127.0.0.1';
  },
  skip: (req) => process.env.NODE_ENV !== 'production' || req.ip === '127.0.0.1' || req.ip === '::1',
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});

// Authentication session attacher
app.use('/api', authenticateToken);

// Mount API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'SQLite (trishul.db)',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    error: 'Internal server error occurred.',
  });
});

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`[Trishul Backend] Server running on http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error('[Trishul Backend] Startup failure:', err);
    process.exit(1);
  }
}

// Start if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}

export default app;
