const { body } = require('express-validator');
const User = require('../models/User');

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
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
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
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: {
        _id: user._id,
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

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

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
 * @desc    Delete user account
 */
const deleteProfile = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    /* Clean up related data */
    const mongoose = require('mongoose');
    const userId = req.user._id;
    await Promise.all([
      mongoose.model('Watchlist').deleteMany({ userId }),
      mongoose.model('Portfolio').deleteMany({ userId }),
      mongoose.model('RecentSearch').deleteMany({ userId }),
      mongoose.model('Favorite').deleteMany({ userId }),
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
