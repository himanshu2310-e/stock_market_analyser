/**
 * Global Express error handler.
 * Catches errors thrown in route handlers and middleware.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  /* Mongoose bad ObjectId */
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID format',
    });
  }

  /* Mongoose duplicate key */
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for "${field}". This ${field} already exists.`,
    });
  }

  /* Mongoose validation error */
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages,
    });
  }

  /* JWT errors */
  if (err.name === 'JsonWebTokenError') {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res
      .status(401)
      .json({ success: false, message: 'Token has expired' });
  }

  /* Default 500 */
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
