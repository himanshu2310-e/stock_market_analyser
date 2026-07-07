const store = require('../utils/jsonStore');

const WATCHLIST_FILE = 'watchlist.json';

/**
 * @route   GET /api/watchlist
 * @desc    Get user's watchlist
 */
const getWatchlist = async (req, res, next) => {
  try {
    const items = await store.findAll(WATCHLIST_FILE, { userId: req.user.id });
    /* Sort: pinned first, then newest first */
    items.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/watchlist
 * @desc    Add stock to watchlist
 */
const addToWatchlist = async (req, res, next) => {
  try {
    const { symbol, companyName } = req.body;

    if (!symbol) {
      return res
        .status(400)
        .json({ success: false, message: 'Symbol is required' });
    }

    /* Check for duplicate (userId + symbol) */
    const existing = await store.findOne(WATCHLIST_FILE, {
      userId: req.user.id,
      symbol: symbol.toUpperCase().trim(),
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'Stock already in watchlist' });
    }

    const item = await store.create(WATCHLIST_FILE, {
      userId: req.user.id,
      symbol: symbol.toUpperCase().trim(),
      companyName: companyName || symbol,
      pinned: false,
    });

    res.status(201).json({
      success: true,
      message: 'Added to watchlist',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/watchlist/:id/pin
 * @desc    Toggle pin status
 */
const togglePin = async (req, res, next) => {
  try {
    const existing = await store.findOne(WATCHLIST_FILE, {
      id: req.params.id,
      userId: req.user.id,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Watchlist item not found' });
    }

    const item = await store.updateById(WATCHLIST_FILE, req.params.id, {
      pinned: !existing.pinned,
    });

    res.status(200).json({
      success: true,
      message: item.pinned ? 'Pinned' : 'Unpinned',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/watchlist/:id
 * @desc    Remove stock from watchlist
 */
const removeFromWatchlist = async (req, res, next) => {
  try {
    const existing = await store.findOne(WATCHLIST_FILE, {
      id: req.params.id,
      userId: req.user.id,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Watchlist item not found' });
    }

    await store.deleteById(WATCHLIST_FILE, req.params.id);

    res
      .status(200)
      .json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWatchlist, addToWatchlist, togglePin, removeFromWatchlist };
