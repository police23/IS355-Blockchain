const express = require('express');
const router = express.Router();
const ContractEventController = require('../controllers/ContractEventController');

// GET /api/contract-events
router.get('/', ContractEventController.list);

module.exports = router;
