const { Router } = require('express');
const { getSpecialties } = require('../controllers/specialtyController');

const router = Router();

router.get('/', getSpecialties);

module.exports = router;
