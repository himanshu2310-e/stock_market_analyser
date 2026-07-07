const store = require('../utils/jsonStore');

const PORTFOLIO_FILE = 'portfolio.json';

/**
 * @route   GET /api/portfolio
 * @desc    Get user's portfolio
 */
const getPortfolio = async (req, res, next) => {
  try {
    const items = await store.findAll(PORTFOLIO_FILE, { userId: req.user.id });
    /* Sort newest first */
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/portfolio
 * @desc    Add investment to portfolio
 */
const addInvestment = async (req, res, next) => {
  try {
    const { symbol, companyName, quantity, purchasePrice, purchaseDate, notes } =
      req.body;

    if (!symbol || !quantity || !purchasePrice || !purchaseDate) {
      return res.status(400).json({
        success: false,
        message: 'Symbol, quantity, purchase price, and purchase date are required',
      });
    }

    const item = await store.create(PORTFOLIO_FILE, {
      userId: req.user.id,
      symbol: symbol.toUpperCase().trim(),
      companyName: companyName || symbol,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Investment added',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/portfolio/:id
 * @desc    Update an investment
 */
const updateInvestment = async (req, res, next) => {
  try {
    const { quantity, purchasePrice, purchaseDate, notes } = req.body;

    /* Verify ownership */
    const existing = await store.findOne(PORTFOLIO_FILE, {
      id: req.params.id,
      userId: req.user.id,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Investment not found' });
    }

    const updates = {};
    if (quantity !== undefined) updates.quantity = parseFloat(quantity);
    if (purchasePrice !== undefined) updates.purchasePrice = parseFloat(purchasePrice);
    if (purchaseDate !== undefined) updates.purchaseDate = purchaseDate;
    if (notes !== undefined) updates.notes = notes;

    const item = await store.updateById(PORTFOLIO_FILE, req.params.id, updates);

    res.status(200).json({
      success: true,
      message: 'Investment updated',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/portfolio/:id
 * @desc    Delete an investment
 */
const deleteInvestment = async (req, res, next) => {
  try {
    /* Verify ownership */
    const existing = await store.findOne(PORTFOLIO_FILE, {
      id: req.params.id,
      userId: req.user.id,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Investment not found' });
    }

    await store.deleteById(PORTFOLIO_FILE, req.params.id);

    res.status(200).json({ success: true, message: 'Investment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolio, addInvestment, updateInvestment, deleteInvestment };
