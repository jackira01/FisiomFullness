const { Router } = require('express');
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

const router = Router();

router.get('/', getAppointments);
router.post('/create', createAppointment);
router.post('/update', updateAppointment);
router.post('/delete/:id', deleteAppointment);

module.exports = router;
