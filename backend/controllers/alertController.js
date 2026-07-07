const store = require('../utils/jsonStore');

const ALERTS_FILE = 'alerts.json';

/**
 * @route   GET /api/alerts
 * @desc    Get all alerts for the authenticated user
 */
const getAlerts = async (req, res, next) => {
  try {
    const items = await store.findAll(ALERTS_FILE, { userId: req.user.id });
    /* Sort newest first */
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/alerts
 * @desc    Create a new price alert
 */
const createAlert = async (req, res, next) => {
  try {
    const { symbol, targetPrice, condition } = req.body;

    if (!symbol || targetPrice === undefined || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Symbol, targetPrice, and condition are required',
      });
    }

    if (!['above', 'below'].includes(condition)) {
      return res.status(400).json({
        success: false,
        message: 'Condition must be "above" or "below"',
      });
    }

    const item = await store.create(ALERTS_FILE, {
      userId: req.user.id,
      symbol: symbol.toUpperCase().trim(),
      targetPrice: parseFloat(targetPrice),
      condition,
    });

    res.status(201).json({
      success: true,
      message: 'Alert created',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/alerts/:id
 * @desc    Delete a price alert
 */
const deleteAlert = async (req, res, next) => {
  try {
    const existing = await store.findOne(ALERTS_FILE, {
      id: req.params.id,
      userId: req.user.id,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Alert not found' });
    }

    await store.deleteById(ALERTS_FILE, req.params.id);

    res.status(200).json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAlerts, createAlert, deleteAlert };
