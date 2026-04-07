const getAllowedOrigins = () => {
  const allowedOriginsString = process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3001,http://localhost:3000,http://localhost:5173';
  return allowedOriginsString.split(',').map(origin => origin.trim());
};

const originValidator = (origin, callback) => {
  // Peticiones sin Origin (server-to-server, Postman, etc.)
  if (!origin) return callback(null, true);

  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) return callback(null, true);

  callback(new Error(`Origen no permitido por CORS: ${origin}`));
};

const optionCors = {
  origin: originValidator,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { optionCors };
