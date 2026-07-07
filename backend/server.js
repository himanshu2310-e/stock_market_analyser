const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { initDataDir } = require('./utils/jsonStore');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const newsRoutes = require('./routes/newsRoutes');
const marketRoutes = require('./routes/marketRoutes');
const alertRoutes = require('./routes/alertRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

/* ---------- Initialize JSON data directory ---------- */
initDataDir().then(() => {
  console.log('✅ JSON data store initialized');
}).catch((err) => {
  console.error('❌ Failed to initialize data store:', err.message);
});

/* ---------- Global Middleware ---------- */
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', apiLimiter);

/* ---------- API Routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/history', historyRoutes);

/* ---------- Health Check ---------- */
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* ---------- 404 Fallback ---------- */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ---------- Global Error Handler ---------- */
app.use(errorHandler);

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

module.exports = app;
