const store = require('../utils/jsonStore');

const HISTORY_FILE = 'history.json';

/**
 * @route   GET /api/history
 * @desc    Get transaction history for the authenticated user
 */
const getHistory = async (req, res, next) => {
  try {
    const items = await store.findAll(HISTORY_FILE, { userId: req.user.id });
    /* Sort newest first */
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/history
 * @desc    Record a transaction
 */
const addHistory = async (req, res, next) => {
  try {
    const { action, symbol, quantity, price, date } = req.body;

    if (!action || !symbol || quantity === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Action, symbol, quantity, and price are required',
      });
    }

    const item = await store.create(HISTORY_FILE, {
      userId: req.user.id,
      action: action.toUpperCase().trim(),
      symbol: symbol.toUpperCase().trim(),
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      date: date || new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Transaction recorded',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete a history entry
 */
const deleteHistory = async (req, res, next) => {
  try {
    const existing = await store.findOne(HISTORY_FILE, {
      id: req.params.id,
      userId: req.user.id,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'History entry not found' });
    }

    await store.deleteById(HISTORY_FILE, req.params.id);

    res.status(200).json({ success: true, message: 'History entry deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, addHistory, deleteHistory };
