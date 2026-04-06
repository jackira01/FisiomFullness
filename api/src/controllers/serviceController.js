const Service = require('../models/Service');

/**
 * GET /services?professionalId=xxx&limit=100&offset=0&page=1
 * Retorna los servicios de un profesional.
 */
exports.getServices = async (req, res) => {
  const { professionalId, limit = 100, offset = 0 } = req.query;

  try {
    const query = { status: true };
    if (professionalId) query.professionalId = professionalId;

    const services = await Service.find(query)
      .skip(Number(offset))
      .limit(Number(limit));

    const total = await Service.countDocuments(query);

    return res.status(200).json({ services, total });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * POST /services
 * Crea un nuevo servicio para un profesional.
 */
exports.createService = async (req, res) => {
  const { professionalId, title, description, price, duration } = req.body;

  if (!professionalId || !title) {
    return res
      .status(400)
      .json({ message: 'El ID del profesional y el título son requeridos' });
  }

  try {
    const service = new Service({
      professionalId,
      title,
      description: description || '',
      price: price || 0,
      duration: duration || 60,
    });

    await service.save();
    return res
      .status(200)
      .json({ message: 'Servicio creado exitosamente', service });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /services/:id
 * Actualiza un servicio existente.
 */
exports.updateService = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const service = await Service.findByIdAndUpdate(id, updates, { new: true });

    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    return res
      .status(200)
      .json({ message: 'Servicio actualizado exitosamente', service });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /services/:id
 * Desactiva (soft-delete) un servicio.
 */
exports.deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    return res.status(200).json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
