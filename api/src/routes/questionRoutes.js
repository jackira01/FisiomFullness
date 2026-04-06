const express = require('express');
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  respondQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const authToken = require('../middleware/authToken');
const { adminAuthMiddleware } = require('../middleware/adminMiddleware');

router.get('/', getQuestions);
router.post('/create', authToken, createQuestion);
router.put('/response/:questionId', authToken, respondQuestion);
router.delete('/:questionId', adminAuthMiddleware, deleteQuestion);

module.exports = router;
