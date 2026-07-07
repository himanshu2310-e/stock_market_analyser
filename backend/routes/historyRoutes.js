const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getHistory,
  addHistory,
  deleteHistory,
} = require('../controllers/historyController');

const router = express.Router();

router.use(protect);

router.get('/', getHistory);
router.post('/', addHistory);
router.delete('/:id', deleteHistory);

module.exports = router;
