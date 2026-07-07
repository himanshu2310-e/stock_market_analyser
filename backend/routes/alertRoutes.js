const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getAlerts,
  createAlert,
  deleteAlert,
} = require('../controllers/alertController');

const router = express.Router();

router.use(protect);

router.get('/', getAlerts);
router.post('/', createAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
