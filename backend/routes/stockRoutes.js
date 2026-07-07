const express = require('express');
const { protect } = require('../middleware/auth');
const {
  searchStocks,
  getStock,
  getHistorical,
  getIndicators,
} = require('../controllers/stockController');

const router = express.Router();

/**
 * Stock routes — the optional auth middleware attaches req.user
 * if a token is present (for saving recent searches) but does
 * not block unauthenticated access.
 */
const optionalAuth = async (req, _res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const jwt = require('jsonwebtoken');
      const store = require('../utils/jsonStore');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await store.findById('users.json', decoded.id);
      if (user) {
        const { password, ...safeUser } = user;
        req.user = safeUser;
      }
    }
  } catch {
    /* Silently ignore — user just won't be attached */
  }
  next();
};

router.get('/search', optionalAuth, searchStocks);
router.get('/historical/:symbol', getHistorical);
router.get('/indicators/:symbol', getIndicators);
router.get('/:symbol', optionalAuth, getStock);

module.exports = router;
