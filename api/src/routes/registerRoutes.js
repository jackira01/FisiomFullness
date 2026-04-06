const { Router } = require('express');
const { createUser } = require('../controllers/userController');

const router = Router();

// Forzar role='professional' antes de delegar al controlador genérico
router.post('/professional', (req, res, next) => {
  req.body.role = 'professional';
  next();
}, createUser);

module.exports = router;
