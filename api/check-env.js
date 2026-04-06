#!/usr/bin/env node
/**
 * Script para verificar que las variables de entorno están configuradas correctamente
 */
require('dotenv').config();

console.log('\n=== Verificación de Variables de Entorno ===\n');

const requiredVars = {
  'MJ_APIKEY_PUBLIC': 'Mailjet Public API Key',
  'MJ_APIKEY_PRIVATE': 'Mailjet Private API Key',
  'EMAIL_SENDER': 'Dirección de correo remitente',
  'APP_NAME': 'Nombre de la aplicación',
  'MONGODB_URI': 'URI de MongoDB',
  'JWT_secret': 'Secret para JWT'
};

let allConfigured = true;

for (const [key, description] of Object.entries(requiredVars)) {
  const value = process.env[key];
  const status = value ? '✓ Configurada' : '✗ Falta';
  const display = value ? `${value.substring(0, 20)}...` : 'NO CONFIGURADA';

  console.log(`${status}: ${key}`);
  console.log(`   Descripción: ${description}`);
  console.log(`   Valor: ${display}\n`);

  if (!value) {
    allConfigured = false;
  }
}

console.log('=== Resultado ===');
if (allConfigured) {
  console.log('✓ Todas las variables críticas están configuradas\n');
  process.exit(0);
} else {
  console.log('✗ Faltan variables de entorno. Por favor configura el archivo .env.local\n');
  process.exit(1);
}
