const express = require('express');
const router = express.Router();
const { createRoom } = require('../controllers/chatController');
const authUser = require('../middleware/authUser');

router.post('/room', authUser, createRoom);

module.exports = router;
