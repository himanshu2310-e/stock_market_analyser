const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getWatchlist,
  addToWatchlist,
  togglePin,
  removeFromWatchlist,
} = require('../controllers/watchlistController');

const router = express.Router();

router.use(protect);

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.put('/:id/pin', togglePin);
router.delete('/:id', removeFromWatchlist);

module.exports = router;
