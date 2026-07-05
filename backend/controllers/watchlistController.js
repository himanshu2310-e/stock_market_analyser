const Watchlist = require('../models/Watchlist');

/**
 * @route   GET /api/watchlist
 * @desc    Get user's watchlist
 */
const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ userId: req.user._id }).sort({
      pinned: -1,
      createdAt: -1,
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

    const existing = await Watchlist.findOne({
      userId: req.user._id,
      symbol: symbol.toUpperCase(),
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'Stock already in watchlist' });
    }

    const item = await Watchlist.create({
      userId: req.user._id,
      symbol: symbol.toUpperCase(),
      companyName: companyName || symbol,
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
    const item = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Watchlist item not found' });
    }

    item.pinned = !item.pinned;
    await item.save();

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
    const item = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Watchlist item not found' });
    }

    res
      .status(200)
      .json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWatchlist, addToWatchlist, togglePin, removeFromWatchlist };
