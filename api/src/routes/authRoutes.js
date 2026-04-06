const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/verify-token', authController.verifyToken);
router.post('/refresh', authController.refreshToken);
router.post('/google', authController.authGoogle);

module.exports = router;
