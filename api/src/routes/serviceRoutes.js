const { Router } = require('express');
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

const router = Router();

router.get('/', getServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
