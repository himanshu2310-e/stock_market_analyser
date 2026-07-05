const express = require('express');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
  updateProfileRules,
  changePasswordRules,
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfileRules, validate, updateProfile);
router.put('/change-password', changePasswordRules, validate, changePassword);
router.delete('/profile', deleteProfile);

module.exports = router;
