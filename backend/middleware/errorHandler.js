/**
 * Global Express error handler.
 * Catches errors thrown in route handlers and middleware.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  /* JSON file read/write errors */
  if (err.code === 'ENOENT') {
    return res.status(500).json({
      success: false,
      message: 'Data file not found — it will be created on next request',
    });
  }

  if (err.code === 'EACCES' || err.code === 'EPERM') {
    return res.status(500).json({
      success: false,
      message: 'File permission error — cannot read/write data',
    });
  }

  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    return res.status(500).json({
      success: false,
      message: 'Data file contains invalid JSON',
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
