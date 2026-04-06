const User = require('../models/User');

/**
 * GET /specialty/
 * Returns unique specialty values from professional users in the DB.
 * Response format: { results: [{ id: string, name: string }] }
 */
exports.getSpecialties = async (req, res) => {
  try {
    const specialties = await User.distinct('specialty', {
      role: 'professional',
      specialty: { $ne: '', $exists: true },
    });

    const results = specialties
      .filter(Boolean)
      .sort()
      .map((name) => ({ id: name, name }));

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
