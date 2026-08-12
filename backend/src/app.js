/**
 * Main Application Module: app.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Configures Express middleware, security headers, routing, and Swagger UI.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const aiProxyRoutes = require('./routes/aiProxyRoutes');
const globalErrorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

const env = require('./config/env');

// 1. Security & CORS Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || env.ALLOWED_ORIGINS.includes(origin) || env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    }
  },
  credentials: true
}));

// 2. Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Global Rate Limiter
app.use('/api/', apiLimiter);

// 4. OpenAPI / Swagger Documentation Definition
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'SupportSense AI REST API Documentation',
    version: '1.0.0',
    description: 'Enterprise REST APIs for SupportSense AI Customer Support Ticket System'
  },
  servers: [{ url: '/api/v1', description: 'Local API Server' }]
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 5. Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  });
});

// 6. Application API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/ai', aiProxyRoutes);

// 7. Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
