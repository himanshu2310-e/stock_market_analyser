const express = require('express');
const {
  getMarketOverview,
  getGainers,
  getLosers,
  getActive,
} = require('../controllers/marketController');

const router = express.Router();

router.get('/overview', getMarketOverview);
router.get('/gainers', getGainers);
router.get('/losers', getLosers);
router.get('/active', getActive);

module.exports = router;
