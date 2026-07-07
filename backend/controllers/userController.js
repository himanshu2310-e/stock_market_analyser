const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const store = require('../utils/jsonStore');

const USERS_FILE = 'users.json';

/* ---------- Validation ---------- */
const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

/* ---------- Controllers ---------- */

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await store.findById(USERS_FILE, req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/user/profile
 * @desc    Update profile (name, email, avatar)
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (email) {
      /* Check that new email isn't already taken by another user */
      const existing = await store.findOne(USERS_FILE, { email: email.toLowerCase() });
      if (existing && existing.id !== req.user.id) {
        return res.status(409).json({
          success: false,
          message: 'This email is already in use',
        });
      }
      updates.email = email.toLowerCase().trim();
    }
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await store.updateById(USERS_FILE, req.user.id, updates);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/user/change-password
 * @desc    Change password (requires current password)
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await store.findById(USERS_FILE, req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await store.updateById(USERS_FILE, req.user.id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/user/profile
 * @desc    Delete user account and all related data
 */
const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await store.deleteById(USERS_FILE, userId);

    /* Clean up all related data */
    await Promise.all([
      store.deleteMany('watchlist.json', { userId }),
      store.deleteMany('portfolio.json', { userId }),
      store.deleteMany('recentSearches.json', { userId }),
      store.deleteMany('favorites.json', { userId }),
      store.deleteMany('alerts.json', { userId }),
      store.deleteMany('history.json', { userId }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
  updateProfileRules,
  changePasswordRules,
};
