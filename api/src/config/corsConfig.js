const getAllowedOrigins = () => {
  const allowedOriginsString = process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3001,http://localhost:3000,http://localhost:5173';
  return allowedOriginsString.split(',').map(origin => origin.trim());
};

const optionCors = {
  origin: getAllowedOrigins(),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { optionCors };
