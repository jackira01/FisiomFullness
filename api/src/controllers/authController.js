require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_secret;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_secret;

/**
 * Parses the raw Cookie header string into an object.
 */
const parseCookies = (cookieHeader = '') => {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((c) => c.trim().split('=').map(decodeURIComponent))
      .filter(([k]) => k)
  );
};

/**
 * GET /auth/verify-token
 * Verifies the access token from either:
 *  - Cookie header (used by serverSideVerify in Next.js)
 *  - Authorization: Bearer <token> header
 */
exports.verifyToken = (req, res) => {
  const cookies = parseCookies(req.headers['cookie']);
  const token =
    cookies.accessToken || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json(decoded);
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * POST /auth/refresh
 * Issues a new access token + refresh token.
 * Accepts the refresh token from:
 *  - req.body.refreshToken  (used from next-auth jwt callback server-side)
 *  - Cookie header          (used from browser fetch with credentials: 'include')
 */
exports.refreshToken = (req, res) => {
  const cookies = parseCookies(req.headers['cookie']);
  const refreshToken = req.body?.refreshToken || cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token no encontrado' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const tokenExpiresInSeg = 3600;
    const refreshExpiresInSeg = 7 * 24 * 60 * 60;

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshExpiresInSeg * 1000,
    });

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenExpiresInSeg,
      refreshExpiresInSeg,
    });
  } catch {
    return res.status(401).json({ message: 'Refresh token inválido o expirado' });
  }
};

/**
 * POST /auth/google
 * Crea o busca un usuario autenticado con Google y genera tokens JWT.
 */
exports.authGoogle = async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email requerido' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    let user = await User.findOne({ email: normalizedEmail });
    let isNewUser = false;

    if (!user) {
      // Crear usuario nuevo con Google
      const username = normalizedEmail.split('@')[0] + '_' + Date.now().toString(36);
      user = new User({
        email: normalizedEmail,
        firstname: name?.split(' ')[0] || '',
        lastname: name?.split(' ').slice(1).join(' ') || '',
        username,
        providers: ['google'],
        hasPassword: false,
        emailVerified: new Date(),
        password: '',
        confirm: true,
      });
      await user.save();
      isNewUser = true;
    } else {
      // Usuario existe, agregar Google como provider si no lo tiene
      if (!user.providers || !user.providers.includes('google')) {
        user.providers = [...(user.providers || ['local']), 'google'];
        user.emailVerified = user.emailVerified || new Date();
        user.firstname = user.firstname?.trim() || name?.split(' ')[0] || '';
        await user.save();
      }
    }

    // Generar tokens JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const tokenExpiresInSeg = 3600;
    const refreshExpiresInSeg = 7 * 24 * 60 * 60;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshExpiresInSeg * 1000,
    });

    return res.json({
      user,
      token,
      refreshToken,
      tokenExpiresInSeg,
      refreshExpiresInSeg,
    });
  } catch (error) {
    console.error('Error en authGoogle:', error);
    return res.status(500).json({ message: 'Error al procesar autenticación con Google' });
  }
};
