const { Router } = require('express');
const {
  getAvailability,
  postAvailability,
  getRatings,
  createRating,
  hasCommented,
  addExperience,
  updateExperience,
  deleteExperience,
  getPendingProfessionals,
  approveProfessional,
} = require('../controllers/professionalController');

const router = Router();

// ── Availability ──────────────────────────────────────────────────────────────
router.get('/availability/:userId', getAvailability);
router.post('/availability/:userId', postAvailability);

// ── Pending / Approve (deben ir ANTES de /:professionalId para evitar conflictos) ──
router.get('/pending', getPendingProfessionals);
router.put('/approve/:professionalId', approveProfessional);

// ── Ratings ───────────────────────────────────────────────────────────────────
router.get('/rating/:professionalId', getRatings);
router.post('/rating', createRating);
router.get('/rating/:professionalId/:userId/hasCommented', hasCommented);

// ── Experience ────────────────────────────────────────────────────────────────
router.post('/:professionalId/experience', addExperience);
router.put('/:professionalId/experience/:experienceId', updateExperience);
router.delete('/:professionalId/experience/:experienceId', deleteExperience);

module.exports = router;
