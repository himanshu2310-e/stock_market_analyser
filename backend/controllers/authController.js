const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const store = require('../utils/jsonStore');
const { generateToken } = require('../utils/tokenUtils');
const { sendPasswordResetEmail } = require('../utils/emailService');

const USERS_FILE = 'users.json';

/* ---------- Validation rules ---------- */
const signupRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const resetPasswordRules = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

/* ---------- Controllers ---------- */

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    /* Check for duplicate email */
    const existingUser = await store.findOne(USERS_FILE, { email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    /* Hash password */
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await store.create(USERS_FILE, {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: '',
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return token
 */
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await store.findOne(USERS_FILE, { email: email.toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, rememberMe);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (client-side token removal)
 */
const logout = (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await store.findOne(USERS_FILE, { email: email.toLowerCase() });
    if (!user) {
      /* Don't reveal whether the email exists */
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a reset link has been sent',
      });
    }

    /* Generate reset token */
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await store.updateById(USERS_FILE, user.id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      await store.updateById(USERS_FILE, user.id, {
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      });
      console.error('Email send failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error sending email. Please try again later.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'If that email is registered, a reset link has been sent',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 */
const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    /* Find user with valid reset token */
    const users = await store.readJSON(USERS_FILE);
    const user = users.find(
      (u) =>
        u.resetPasswordToken === hashedToken &&
        u.resetPasswordExpires &&
        u.resetPasswordExpires > Date.now()
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired',
      });
    }

    /* Hash new password and clear reset fields */
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await store.updateById(USERS_FILE, user.id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  signupRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
};
