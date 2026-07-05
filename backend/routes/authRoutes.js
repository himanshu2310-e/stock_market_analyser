const express = require('express');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  signupRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authLimiter, signupRules, validate, signup);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordRules, validate, resetPassword);

module.exports = router;
