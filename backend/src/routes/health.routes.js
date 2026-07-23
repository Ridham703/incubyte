const { Router } = require('express');
const { healthController } = require('../controllers/health.controller');

const router = Router();

router.get('/health', (req, res) => healthController.getHealth(req, res));

module.exports = router;
