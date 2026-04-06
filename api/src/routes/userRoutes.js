const { Router } = require('express');
const {
  createUser,
  getUser,
  getProfessionalFilters,
  getDetail,
  updateUser,
  statusUser,
  deleteUser,
  geocode,
} = require('../controllers/userController');

const router = Router();

router.post('/create', createUser);
router.get('/geocode', geocode);
router.get('/professionals/filters', getProfessionalFilters);
router.get('/', getUser);
router.get('/detail/:id', getDetail);
router.put('/update/:id', updateUser);
router.patch('/status/:id', statusUser);

// Ruta para eliminar usuarios creados por error o por otros motivos, no borrar
router.delete('/delete/:id', deleteUser);

module.exports = router;
