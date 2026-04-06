const bcrypt = require('bcrypt');
const { cloudinary } = require('../config/cloudinaryConfig');
const User = require('../models/User');
const Type = require('../models/Type');
const Comment = require('../models/Comment');

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const cleanText = (value = '') => String(value).trim();

const extractSpecialties = (user = {}) => {
  const collected = [];

  if (typeof user.specialty === 'string' && user.specialty.trim()) {
    collected.push(user.specialty.trim());
  }

  if (Array.isArray(user.specialties)) {
    user.specialties.forEach((specialty) => {
      if (typeof specialty === 'string' && specialty.trim()) {
        collected.push(specialty.trim());
      }

      if (
        specialty &&
        typeof specialty === 'object' &&
        typeof specialty.name === 'string' &&
        specialty.name.trim()
      ) {
        collected.push(specialty.name.trim());
      }
    });
  }

  return [...new Set(collected.filter(Boolean))];
};

const matchesSearchTokens = (user = {}, search = '') => {
  const tokens = String(search)
    .split(',')
    .map((token) => normalizeText(token))
    .filter(Boolean);

  if (!tokens.length) return true;

  const searchableFields = [
    user.firstname,
    user.lastname,
    `${user.firstname || ''} ${user.lastname || ''}`,
    user.username,
    user.email,
    user.address?.city,
    user.address?.state,
    user.address?.country,
    ...extractSpecialties(user),
  ]
    .filter(Boolean)
    .map((value) => normalizeText(value));

  return tokens.every((token) =>
    searchableFields.some((field) => field.includes(token))
  );
};

exports.createUser = async (req, res) => {
  const {
    email,
    firstname,
    lastname,
    name,
    password,
    username,
    phone,
    latitude,
    longitude,
    role,
    specialty,
  } = req.body;

  try {
    // Validar campos requeridos
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ message: 'Email es requerido y debe ser válido' });
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      return res.status(400).json({ message: 'Contraseña es requerida y debe ser una cadena de texto válida' });
    }

    // Generar username si no se proporciona (para profesionales)
    let finalUsername = username;
    if (!finalUsername || typeof finalUsername !== 'string' || finalUsername.trim().length === 0) {
      // Generar username a partir del email o nombre
      finalUsername = name ? name.toLowerCase().replace(/\s+/g, '') : email.split('@')[0];
      // Asegurar que elUsername sea único
      let baseUsername = finalUsername;
      let counter = 1;
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = `${baseUsername}${counter}`;
        counter++;
      }
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Separar nombre en firstname y lastname si se proporciona "name"
    let finalFirstname = firstname || '';
    let finalLastname = lastname || '';
    if (name && !firstname && !lastname) {
      const nameParts = name.trim().split(/\s+/);
      finalFirstname = nameParts[0];
      finalLastname = nameParts.slice(1).join(' ') || '';
    }

    // Validar ubicación obligatoria para profesionales
    const resolvedRole = role || 'user';
    if (resolvedRole === 'professional') {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ message: 'Ubicación geográfica válida es requerida para profesionales' });
      }
    }

    // Verificar si el email ya existe
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ message: 'El email ya está registrado. Por favor usa otro email' });
    }

    // Verificar si el username ya existe
    const existingUsername = await User.findOne({ username: finalUsername });
    if (existingUsername) {
      return res.status(409).json({ message: 'El nombre de usuario ya está registrado. Por favor elige otro' });
    }

    let urlImage = undefined;

    // Si el frontend ya subió la imagen a Cloudinary, usa la URL directamente
    if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('http')) {
      urlImage = req.body.image;
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newData = {
      email: email.toLowerCase(),
      firstname: finalFirstname || '',
      lastname: finalLastname || '',
      password: hashedPassword,
      username: finalUsername,
      phone: phone || '',
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(longitude) || 0, // GeoJSON: [longitude, latitude]
          parseFloat(latitude) || 0,
        ],
      },
      address: {
        streetName: req.body.streetName || '',
        streetNumber: req.body.streetNumber || '',
        floorAppartment: req.body.floorAppartment || '',
        additionalInfo: req.body.additionalInfo || '',
        city: req.body.city || '',
        state: req.body.state || '',
        country: req.body.country || '',
      },
      role: resolvedRole,
      image: urlImage,
      // Campos adicionales para profesionales
      ...(resolvedRole === 'professional' && {
        specialty: specialty || '',
        consultationPrice: req.body.consultationPrice || 0,
        license: req.body.license || '',
      }),
    };

    const user = new User(newData);
    await user.save();

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstname: user.firstname
      }
    });
  } catch (error) {
    console.error('Error en createUser:', error);

    // Manejar errores de MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'email'
        ? 'El email ya está registrado'
        : 'El nombre de usuario ya está registrado';
      return res.status(409).json({ message });
    }

    return res.status(400).json({ message: error.message || 'Error al registrar el usuario' });
  }
};
// Proyección para la lista: excluye campos pesados/sensibles no necesarios en listados
const LIST_PROJECTION = {
  password: 0,
  token: 0,
  hasPassword: 0,
  providers: 0,
  emailVerified: 0,
  confirm: 0,
  experience: 0,
  availability: 0,
};

// Escapa caracteres especiales de regex para uso seguro en $regex
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getUser = async (req, res) => {
  const {
    email,
    role,
    search = '',
    city = '',
    state = '',
    country = '',
    specialty = '',
    specialtyId = '',
    page,
    limit,
  } = req.query;

  try {
    // Ruta rápida: búsqueda solo por email (usada en login/auth flows)
    if (email && !role && !search && !city && !state && !country && !specialty && !specialtyId && !page && !limit) {
      const userFilter = await User.find(
        { email: { $regex: escapeRegex(email.toLowerCase()), $options: 'i' } },
        LIST_PROJECTION
      ).lean();
      if (!userFilter.length) throw new Error('user not found');
      return res.status(200).json({ userFilter });
    }

    // Construir query MongoDB
    const query = {};
    const andConditions = [];

    if (role) query.role = role;

    if (city) {
      query['address.city'] = { $regex: escapeRegex(city), $options: 'i' };
    }
    if (state) {
      query['address.state'] = { $regex: escapeRegex(state), $options: 'i' };
    }
    if (country) {
      query['address.country'] = { $regex: escapeRegex(country), $options: 'i' };
    }

    const requestedSpecialty = (specialtyId || specialty).trim();
    if (requestedSpecialty) {
      const specialtyRegex = { $regex: escapeRegex(requestedSpecialty), $options: 'i' };
      andConditions.push({
        $or: [
          { specialty: specialtyRegex },
          { 'specialties.name': specialtyRegex },
        ],
      });
    }

    if (search) {
      const tokens = String(search)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      tokens.forEach((token) => {
        const tokenRegex = { $regex: escapeRegex(token), $options: 'i' };
        andConditions.push({
          $or: [
            { firstname: tokenRegex },
            { lastname: tokenRegex },
            { username: tokenRegex },
            { email: tokenRegex },
            { 'address.city': tokenRegex },
            { 'address.state': tokenRegex },
            { specialty: tokenRegex },
            { 'specialties.name': tokenRegex },
          ],
        });
      });
    }

    if (andConditions.length) query.$and = andConditions;

    // Sin paginación: devolver todos los que coincidan (sin campos pesados)
    if (!page && !limit) {
      const users = await User.find(query, LIST_PROJECTION).lean();
      return res.status(200).json({ users });
    }

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 12, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query, LIST_PROJECTION).skip(skip).limit(parsedLimit).lean(),
    ]);

    const totalPages = Math.max(Math.ceil(total / parsedLimit), 1);

    return res.status(200).json({
      users,
      total,
      totalPages,
      page: parsedPage,
      limit: parsedLimit,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.getProfessionalFilters = async (_req, res) => {
  try {
    // Obtener todas las especialidades desde la tabla Type
    const types = await Type.find({}).lean();
    const specialties = types
      .map((type) => ({
        id: type.name,
        name: type.name,
      }))
      .sort((left, right) => left.name.localeCompare(right.name, 'es'));

    // Obtener estados y ciudades desde los profesionales activos (solo campos necesarios)
    const professionals = await User.find(
      { role: 'professional' },
      { 'address.state': 1, 'address.city': 1, 'address.country': 1, _id: 0 }
    ).lean();
    const statesMap = new Map();

    professionals.forEach((professional) => {
      const stateName = cleanText(professional.address?.state);
      const cityName = cleanText(professional.address?.city);
      const countryName = cleanText(professional.address?.country) || 'Colombia';
      const stateKey = normalizeText(stateName);

      if (!stateKey) return;

      if (!statesMap.has(stateKey)) {
        statesMap.set(stateKey, {
          name: stateName,
          country: countryName,
          cities: new Map(),
        });
      }

      if (cityName) {
        statesMap.get(stateKey).cities.set(normalizeText(cityName), cityName);
      }
    });

    const states = [...statesMap.values()]
      .map((stateItem) => ({
        name: stateItem.name,
        country: stateItem.country,
        cities: [...stateItem.cities.values()].sort((left, right) =>
          left.localeCompare(right, 'es')
        ),
      }))
      .sort((left, right) => left.name.localeCompare(right.name, 'es'));

    return res.status(200).json({ specialties, states });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    email,
    firstname,
    lastname,
    password,
    username,
    phone,
    latitude,
    longitude,
    streetName,
    streetNumber,
    floorAppartment,
    additionalInfo,
    city,
    state,
    country,
    specialty,
  } = req.body;

  try {
    let newImage = undefined;

    // Si el frontend ya subió la imagen a Cloudinary, usa la URL directamente
    if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('http')) {
      newImage = req.body.image;
    }

    // Hash de la contraseña solo si se proporciona una nueva
    let finalPassword = password;
    if (password && typeof password === 'string' && password.trim().length > 0) {
      // Validar longitud mínima
      if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      }
      // Hacer hash de la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      finalPassword = await bcrypt.hash(password, salt);
    }

    const newData = {
      email,
      firstname,
      lastname,
      password: finalPassword,
      username,
      phone,
      location: latitude != null && longitude != null
        ? { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] }
        : undefined,
      address: {
        streetName: streetName || '',
        streetNumber: streetNumber || '',
        floorAppartment: floorAppartment || '',
        additionalInfo: additionalInfo || '',
        city: city || '',
        state: state || '',
        country: country || '',
      },
      specialty,
      image: newImage,
    };
    // Eliminar campos undefined para no sobreescribir datos existentes
    Object.keys(newData).forEach((k) => newData[k] === undefined && delete newData[k]);
    await User.findByIdAndUpdate({ _id: id }, newData);
    return res.status(200).json({ message: 'User has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.statusUser = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) throw new Error('the blog does not exist');

    user.status = status;
    await user.save();

    return res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    if (id === '64c2d44f61cc7d6cec9d2abb') throw new Error('Dont remove admin');
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('the user does not exist');
    await Comment.deleteMany({ user_id: id });

    return res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * GET /users/geocode?city=Bogot%C3%A1&state=Cundinamarca&country=Colombia
 * Convierte ciudad + estado en coordenadas usando Google Geocoding API.
 * Requiere GOOGLE_MAPS_API_KEY en el .env del servidor.
 */
exports.geocode = async (req, res) => {
  const { city, state, country } = req.query;

  console.log('\n[Geocoding] ─────────────────────────────────────');
  console.log('[Geocoding] → Petición recibida:', { city, state, country });

  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    console.warn('[Geocoding] ✗ Falta el campo ciudad');
    return res.status(400).json({ message: 'Ciudad es requerida' });
  }
  if (!state || typeof state !== 'string' || state.trim().length === 0) {
    console.warn('[Geocoding] ✗ Falta el campo estado/municipio');
    return res.status(400).json({ message: 'Estado/municipio es requerido' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('[Geocoding] ✗ GOOGLE_MAPS_API_KEY no está configurada en el .env del servidor');
    return res.status(500).json({
      message: 'Servicio de geocodificación no configurado. Agrega GOOGLE_MAPS_API_KEY al .env del servidor.',
    });
  }

  const address = [city.trim(), state.trim(), country?.trim()]
    .filter(Boolean)
    .join(', ');

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  console.log('[Geocoding] → Dirección a geocodificar:', address);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('[Geocoding] ← Status de Google:', data.status);
    console.log('[Geocoding] ← Resultados obtenidos:', data.results?.length ?? 0);

    if (data.status === 'REQUEST_DENIED') {
      console.error('[Geocoding] ✗ API key inválida o sin permisos para Geocoding API');
      console.error('[Geocoding]   Mensaje de Google:', data.error_message);
      return res.status(403).json({ message: 'API key de Google sin permisos para geocodificación' });
    }

    if (data.status !== 'OK' || !data.results?.length) {
      console.warn('[Geocoding] ✗ Sin resultados | Status:', data.status);
      return res.status(404).json({ message: 'No se encontró la ubicación indicada' });
    }

    const firstResult = data.results[0];
    const { lat, lng } = firstResult.geometry.location;

    console.log(`[Geocoding] ✓ Coordenadas encontradas: lat=${lat}, lng=${lng}`);
    console.log('[Geocoding] ✓ Dirección formateada:', firstResult.formatted_address);
    console.log('[Geocoding] ─────────────────────────────────────\n');

    return res.status(200).json({
      latitude: lat,
      longitude: lng,
      formattedAddress: firstResult.formatted_address,
    });
  } catch (error) {
    console.error('[Geocoding] ✗ Error al llamar la API de Google:', error.message);
    return res.status(500).json({ message: 'Error al geocodificar la dirección' });
  }
};
