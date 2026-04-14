const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/profile', authMiddleware, companyController.createProfile);
router.get('/profile', authMiddleware, companyController.getProfile);

module.exports = router;