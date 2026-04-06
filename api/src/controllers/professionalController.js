const User = require('../models/User');
const Rating = require('../models/Rating');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Recalcula y persiste el rating promedio de un profesional.
 */
async function recalculateRating(professionalId) {
  const ratings = await Rating.find({ professionalId, status: true });
  const count = ratings.length;
  const average =
    count > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.score, 0) / count) * 10) / 10
      : 0;
  await User.findByIdAndUpdate(professionalId, { 'rating.average': average, 'rating.count': count });
  return { average, count };
}

// ─── Availability ─────────────────────────────────────────────────────────────

/**
 * GET /professionals/availability/:userId
 * Retorna la disponibilidad horaria de un profesional.
 */
exports.getAvailability = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId, 'availability');
    if (!user) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    return res.status(200).json({ availability: user.availability || [] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * POST /professionals/availability/:userId
 * Actualiza la disponibilidad horaria de un profesional.
 * Body: { availability: [{ day, timeSlots: [{ _id?, start, end }] }] }
 */
exports.postAvailability = async (req, res) => {
  const { userId } = req.params;
  const { availability } = req.body;

  if (!Array.isArray(availability)) {
    return res.status(400).json({ message: 'El campo availability debe ser un arreglo' });
  }

  // Asegurar que cada timeSlot tenga un _id
  const normalizedAvailability = availability.map((daySlot) => ({
    day: daySlot.day,
    timeSlots: (daySlot.timeSlots || []).map((slot) => ({
      _id: slot._id || new ObjectId().toString(),
      start: slot.start,
      end: slot.end,
    })),
  }));

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { availability: normalizedAvailability },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    return res.status(200).json({
      message: 'Disponibilidad actualizada exitosamente',
      userAvailability: user.availability,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ─── Ratings ─────────────────────────────────────────────────────────────────

/**
 * GET /professionals/rating/:professionalId?offset=0&limit=10
 * Lista los comentarios/valoraciones de un profesional, con paginación por offset.
 * Respuesta: { comments: [...], hasMoreToLoad: boolean }
 */
exports.getRatings = async (req, res) => {
  const { professionalId } = req.params;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const total = await Rating.countDocuments({ professionalId, status: true });
    const ratings = await Rating.find({ professionalId, status: true })
      .sort({ createdDate: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    // Poblar datos del usuario que comentó
    const populated = await Promise.all(
      ratings.map(async (r) => {
        const uid = r.userId || r._user;
        const user = uid
          ? await User.findById(uid, 'firstname lastname username image').lean()
          : null;
        return {
          ...r,
          _user: user
            ? {
              _id: user._id,
              name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.username,
              image: user.image || null,
            }
            : { _id: uid, name: 'Usuario', image: null },
        };
      })
    );

    return res.status(200).json({
      comments: populated,
      hasMoreToLoad: offset + limit < total,
      total,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * POST /professionals/rating
 * Crea una nueva valoración para un profesional.
 * Body: { _professional, _user, score, description }
 * Respuesta: { newRating, message }
 */
exports.createRating = async (req, res) => {
  const { _professional, _user, score, description } = req.body;

  if (!_professional || !_user) {
    return res.status(400).json({ message: 'professionalId y userId son requeridos' });
  }
  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ message: 'La puntuación debe ser entre 1 y 5' });
  }

  try {
    // Verificar que el profesional exista
    const professional = await User.findById(_professional);
    if (!professional || professional.role !== 'professional') {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    // Verificar que el usuario no haya comentado ya
    const existing = await Rating.findOne({ professionalId: _professional, userId: _user, status: true });
    if (existing) {
      return res.status(409).json({ message: 'Ya has dejado una valoración a este profesional' });
    }

    const rating = await Rating.create({
      professionalId: _professional,
      _professional,
      userId: _user,
      _user,
      score: Number(score),
      description: description || '',
    });

    // Recalcular promedio
    const { average, count } = await recalculateRating(_professional);

    // Poblar datos del usuario para devolver al frontend
    const commentUser = await User.findById(_user, 'firstname lastname username image').lean();

    const newRating = {
      ...rating.toObject(),
      _user: commentUser
        ? {
          _id: commentUser._id,
          name: `${commentUser.firstname || ''} ${commentUser.lastname || ''}`.trim() || commentUser.username,
          image: commentUser.image || null,
        }
        : { _id: _user, name: 'Usuario', image: null },
    };

    return res.status(201).json({
      message: 'Valoración creada exitosamente',
      newRating,
      updatedRating: { average, count },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * GET /professionals/rating/:professionalId/:userId/hasCommented
 * Verifica si un usuario ya dejó una valoración a un profesional.
 * Respuesta: { hasCommented: boolean }
 */
exports.hasCommented = async (req, res) => {
  const { professionalId, userId } = req.params;

  try {
    const existing = await Rating.findOne({ professionalId, userId, status: true });
    return res.status(200).json({ hasCommented: !!existing });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ─── Experience ───────────────────────────────────────────────────────────────

/**
 * POST /professionals/:professionalId/experience
 * Agrega una entrada de experiencia al profesional.
 * Body: { title, company, startDateMonth, startDateYear, endDateMonth, endDateYear, current, description }
 */
exports.addExperience = async (req, res) => {
  const { professionalId } = req.params;
  const { title, company, startDateMonth, startDateYear, endDateMonth, endDateYear, current, description } = req.body;

  if (!title || !company || !startDateMonth || !startDateYear) {
    return res.status(400).json({ message: 'título, empresa, mes y año de inicio son requeridos' });
  }

  try {
    const newExp = {
      _id: new ObjectId().toString(),
      title,
      company,
      startDateMonth: Number(startDateMonth),
      startDateYear: Number(startDateYear),
      endDateMonth: endDateMonth ? Number(endDateMonth) : null,
      endDateYear: endDateYear ? Number(endDateYear) : null,
      current: !!current,
      description: description || '',
    };

    const user = await User.findByIdAndUpdate(
      professionalId,
      { $push: { experience: newExp } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    const added = user.experience.find((e) => e._id === newExp._id);
    return res.status(201).json({ message: 'Experiencia agregada exitosamente', experience: added });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /professionals/:professionalId/experience/:experienceId
 * Actualiza una entrada de experiencia.
 */
exports.updateExperience = async (req, res) => {
  const { professionalId, experienceId } = req.params;
  const updates = req.body;

  try {
    const user = await User.findById(professionalId);
    if (!user) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    const expIndex = user.experience.findIndex((e) => e._id === experienceId);
    if (expIndex === -1) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }

    // Merge con los datos existentes
    Object.assign(user.experience[expIndex], {
      title: updates.title ?? user.experience[expIndex].title,
      company: updates.company ?? user.experience[expIndex].company,
      startDateMonth: updates.startDateMonth != null ? Number(updates.startDateMonth) : user.experience[expIndex].startDateMonth,
      startDateYear: updates.startDateYear != null ? Number(updates.startDateYear) : user.experience[expIndex].startDateYear,
      endDateMonth: updates.endDateMonth != null ? (updates.endDateMonth === '' ? null : Number(updates.endDateMonth)) : user.experience[expIndex].endDateMonth,
      endDateYear: updates.endDateYear != null ? (updates.endDateYear === '' ? null : Number(updates.endDateYear)) : user.experience[expIndex].endDateYear,
      current: updates.current != null ? !!updates.current : user.experience[expIndex].current,
      description: updates.description ?? user.experience[expIndex].description,
    });

    await user.save();
    return res.status(200).json({ message: 'Experiencia actualizada exitosamente', experience: user.experience[expIndex] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /professionals/:professionalId/experience/:experienceId
 * Elimina una entrada de experiencia.
 */
exports.deleteExperience = async (req, res) => {
  const { professionalId, experienceId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      professionalId,
      { $pull: { experience: { _id: experienceId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    return res.status(200).json({ message: 'Experiencia eliminada exitosamente' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ─── Approval ─────────────────────────────────────────────────────────────────

/**
 * GET /professionals/pending
 * Lista los profesionales pendientes de aprobación (isApproved: false).
 * Requiere rol admin.
 */
exports.getPendingProfessionals = async (req, res) => {
  try {
    const professionals = await User.find(
      { role: 'professional', isApproved: false, status: true },
      'firstname lastname email username image specialty specialties createdDate'
    ).lean();

    // Normalizar nombre e isApproved para el componente frontend
    const normalized = professionals.map((p) => ({
      ...p,
      name: `${p.firstname || ''} ${p.lastname || ''}`.trim() || p.username,
      isApproved: false,
    }));

    return res.status(200).json(normalized);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /professionals/approve/:professionalId
 * Aprueba un profesional (isApproved: true).
 * Requiere rol admin.
 */
exports.approveProfessional = async (req, res) => {
  const { professionalId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      professionalId,
      { isApproved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    return res.status(200).json({ message: 'Profesional aprobado exitosamente', professional: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
