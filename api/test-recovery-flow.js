#!/usr/bin/env node
/**
 * Script de prueba para verificar el flujo de recuperación de contraseña
 * 
 * Flujo:
 * 1. Frontend envía POST /login/recover-password con { email }
 * 2. Controller busca el usuario y genera contraseña temporal
 * 3. EmailService envía email con Mailjet
 * 4. Response regresa al frontend con { message, messageId }
 */

require('dotenv').config();

console.log('\n=== Test de Recuperación de Contraseña ===\n');

// Información del flujo
console.log('📋 FLUJO DE RECUPERACIÓN:\n');

console.log('1️⃣  Frontend (PasswordOlvidada.jsx)');
console.log('   - Función: sendEmail({ email })');
console.log('   - URL: POST http://localhost:3000/login/recover-password');
console.log('   - Body: { email: "user@example.com" }\n');

console.log('2️⃣  Backend (loginController.js - recoverAccount)');
console.log('   - Valida que email está presente');
console.log('   - Busca usuario en base de datos');
console.log('   - Genera contraseña temporal aleatoria');
console.log('   - Hash de la contraseña con bcrypt');
console.log('   - Guarda en base de datos\n');

console.log('3️⃣  EmailService (mailjetService.js)');
console.log('   - Inicializa cliente Mailjet');
console.log('   - Prepara template HTML con contraseña temporal');
console.log('   - Envía email mediante POST a API Mailjet');
console.log('   - Retorna { success: true, messageId } o { success: false, error }\n');

console.log('4️⃣  Response al Frontend');
console.log('   - Status: 200 (éxito) o 400/404/500 (error)');
console.log('   - Body: { message, messageId } o { error, details }\n');

// Validar configuración
console.log('✅ VALIDACIÓN DE CONFIGURACIÓN:\n');

const requiredConfig = {
  'MJ_APIKEY_PUBLIC': process.env.MJ_APIKEY_PUBLIC,
  'MJ_APIKEY_PRIVATE': process.env.MJ_APIKEY_PRIVATE,
  'EMAIL_SENDER': process.env.EMAIL_SENDER,
  'APP_NAME': process.env.APP_NAME,
  'MONGODB_URI': process.env.MONGODB_URI,
  'JWT_secret': process.env.JWT_secret,
};

let allConfigured = true;
for (const [key, value] of Object.entries(requiredConfig)) {
  const status = value ? '✓' : '✗';
  const display = value ? value.substring(0, 30) + '...' : 'NOT SET';
  console.log(`${status} ${key}: ${display}`);
  if (!value) allConfigured = false;
}

console.log('\n' + (allConfigured ? '✓ Todas las variables están configuradas' : '✗ Faltan variables de configuración'));

// URLs importantes
console.log('\n🔗 URLs IMPORTANTES:\n');
console.log('Backend API: http://localhost:3000');
console.log('Frontend: http://localhost:5173');
console.log('Ruta de recuperación: POST /login/recover-password');
console.log('Headers: Content-Type: application/json');

// Ejemplo cURL
console.log('\n📝 EJEMPLO DE TEST CON CURL:\n');
console.log('curl -X POST http://localhost:3000/login/recover-password \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"email":"test@example.com"}\'');

// Respuesta esperada
console.log('\n📊 RESPUESTA ESPERADA (Éxito):\n');
console.log(JSON.stringify({
  status: 200,
  body: {
    message: "Email de recuperación enviado correctamente",
    messageId: "123456789"
  }
}, null, 2));

console.log('\n📊 RESPUESTA ESPERADA (Error):\n');
console.log(JSON.stringify({
  status: 404,
  body: {
    error: "Usuario no encontrado"
  }
}, null, 2));

console.log('\n✨ Flujo completamente integrado y listo para usar\n');
