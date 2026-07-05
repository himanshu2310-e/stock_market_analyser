const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getPortfolio,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} = require('../controllers/portfolioController');

const router = express.Router();

router.use(protect);

router.get('/', getPortfolio);
router.post('/', addInvestment);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

module.exports = router;
