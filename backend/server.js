import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import middleware
import {
  generalLimiter,
  createLimiter,
  readLimiter,
} from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Import database connection
import connectToDatabase from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectToDatabase().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request logging - development only
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running!',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/ai', aiRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to StudentsPark API',
    version: '1.0.0',
    endpoints: {
      reviews: {
        'GET /api/v1/reviews': 'Get all reviews',
        'GET /api/v1/reviews/stats': 'Get statistics',
        'GET /api/v1/reviews/user/:userId': 'Get reviews by specific user',
        'GET /api/v1/reviews/me': 'Get my reviews (authenticated)',
        'GET /api/v1/reviews/:id': 'Get specific review',
        'POST /api/v1/reviews': 'Create new review (authenticated)',
        'PUT /api/v1/reviews/:id': 'Update review (authenticated, owner only)',
        'DELETE /api/v1/reviews/:id':
          'Delete review (authenticated, owner or admin)',
      },
      users: {
        'POST /api/v1/users/signup': 'User registration',
        'POST /api/v1/users/login': 'User login',
      },
      ai: {
        'GET /api/v1/ai/company/:companyName/summary': 'Generate AI summary for company',
        'GET /api/v1/ai/company/:companyName/insights': 'Get detailed company insights',
        'GET /api/v1/ai/company/:companyName/role/:jobRole/tips': 'Generate preparation tips',
      },
    },
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
