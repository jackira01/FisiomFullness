const Appointment = require('../models/Appointment');

/**
 * GET /appointments?from=YYYY-MM-DD&to=YYYY-MM-DD&_professional=id
 * Retorna las citas de un profesional en el rango de fechas indicado.
 */
exports.getAppointments = async (req, res) => {
  const { from, to, _professional } = req.query;

  if (!_professional) {
    return res.status(400).json({ message: 'El ID del profesional es requerido' });
  }

  try {
    const query = {
      _professional,
      status: { $ne: 'DEACTIVATE' },
    };

    if (from && to) {
      query.start = { $gte: from, $lte: to + 'T23:59' };
    }

    const appointments = await Appointment.find(query);
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * POST /appointments/create
 * Crea una nueva cita médica.
 */
exports.createAppointment = async (req, res) => {
  const {
    _professional,
    _patient,
    _service,
    start,
    end,
    additionalDescription,
    title,
    status,
  } = req.body;

  if (!_professional || !_patient || !start || !end) {
    return res
      .status(400)
      .json({ message: 'Faltan campos requeridos: profesional, paciente, inicio y fin' });
  }

  try {
    const appointment = new Appointment({
      _professional,
      _patient,
      _service: _service || null,
      start,
      end,
      additionalDescription: additionalDescription || '',
      title: title || '',
      status: status || 'PENDING',
    });

    await appointment.save();
    return res
      .status(200)
      .json({ message: 'Cita creada exitosamente', appointment });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * POST /appointments/update
 * Actualiza una cita existente (también se usa para cambiar status a DEACTIVATE).
 */
exports.updateAppointment = async (req, res) => {
  const { _id, ...updates } = req.body;

  if (!_id) {
    return res.status(400).json({ message: 'El ID de la cita es requerido' });
  }

  try {
    // Excluir _id y campos protegidos de las actualizaciones
    delete updates._professional;

    const appointment = await Appointment.findByIdAndUpdate(_id, updates, {
      new: true,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    return res
      .status(200)
      .json({ message: 'Cita actualizada exitosamente', appointment });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * POST /appointments/delete/:id
 * Desactiva (soft-delete) una cita.
 */
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'DEACTIVATE' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    return res.status(200).json({ message: 'Cita eliminada exitosamente' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
