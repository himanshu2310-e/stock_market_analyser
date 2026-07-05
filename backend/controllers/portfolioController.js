const Portfolio = require('../models/Portfolio');

/**
 * @route   GET /api/portfolio
 * @desc    Get user's portfolio
 */
const getPortfolio = async (req, res, next) => {
  try {
    const items = await Portfolio.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
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

    const item = await Portfolio.create({
      userId: req.user._id,
      symbol: symbol.toUpperCase(),
      companyName: companyName || symbol,
      quantity,
      purchasePrice,
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

    const item = await Portfolio.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Investment not found' });
    }

    if (quantity !== undefined) item.quantity = quantity;
    if (purchasePrice !== undefined) item.purchasePrice = purchasePrice;
    if (purchaseDate !== undefined) item.purchaseDate = purchaseDate;
    if (notes !== undefined) item.notes = notes;

    await item.save();

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
    const item = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Investment not found' });
    }

    res.status(200).json({ success: true, message: 'Investment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolio, addInvestment, updateInvestment, deleteInvestment };
