#!/usr/bin/env node
/**
 * Script para diagnosticar el API de node-mailjet
 */
require('dotenv').config();

console.log('\n=== Diagnóstico de node-mailjet ===\n');

try {
  const mailjetModule = require('node-mailjet');

  console.log('✓ node-mailjet cargado correctamente\n');

  console.log('Tipo de mailjetModule:', typeof mailjetModule);
  console.log('Es una función:', typeof mailjetModule === 'function');
  console.log('Es un objeto:', typeof mailjetModule === 'object');

  console.log('\n=== Propiedades y métodos disponibles ===\n');

  const props = Object.getOwnPropertyNames(mailjetModule);
  const proto = Object.getOwnPropertyNames(Object.getPrototypeOf(mailjetModule));

  console.log('Propiedades propias:');
  props.forEach(prop => {
    console.log(`  - ${prop}: ${typeof mailjetModule[prop]}`);
  });

  console.log('\nMétodos del prototipo:');
  proto.forEach(prop => {
    console.log(`  - ${prop}: ${typeof Object.getPrototypeOf(mailjetModule)[prop]}`);
  });

  console.log('\n=== Intentando diferentes patrones ===\n');

  const apiKey = process.env.MJ_APIKEY_PUBLIC;
  const apiSecret = process.env.MJ_APIKEY_PRIVATE;

  if (!apiKey || !apiSecret) {
    console.log('❌ Variables de entorno no configuradas');
    console.log('MJ_APIKEY_PUBLIC:', apiKey ? '✓' : '✗');
    console.log('MJ_APIKEY_PRIVATE:', apiSecret ? '✓' : '✗');
    process.exit(1);
  }

  // Patrón 1: Invocar como función
  try {
    const client1 = mailjetModule(apiKey, apiSecret);
    console.log('✓ Patrón 1: mailjetModule(apiKey, apiSecret) - FUNCIONA');
    console.log('  Tipo:', typeof client1);
    console.log('  Métodos:', Object.getOwnPropertyNames(client1).slice(0, 5).join(', '));
  } catch (e) {
    console.log('✗ Patrón 1: mailjetModule(apiKey, apiSecret) -', e.message);
  }

  // Patrón 2: Usar .connect()
  try {
    const client2 = mailjetModule.connect(apiKey, apiSecret);
    console.log('✓ Patrón 2: mailjetModule.connect(apiKey, apiSecret) - FUNCIONA');
  } catch (e) {
    console.log('✗ Patrón 2: mailjetModule.connect(apiKey, apiSecret) -', e.message);
  }

  // Patrón 3: Usar .apiConnect()
  try {
    const client3 = mailjetModule.apiConnect(apiKey, apiSecret);
    console.log('✓ Patrón 3: mailjetModule.apiConnect(apiKey, apiSecret) - FUNCIONA');
  } catch (e) {
    console.log('✗ Patrón 3: mailjetModule.apiConnect(apiKey, apiSecret) -', e.message);
  }

  // Patrón 4: Nueva instancia
  try {
    const client4 = new mailjetModule(apiKey, apiSecret);
    console.log('✓ Patrón 4: new mailjetModule(apiKey, apiSecret) - FUNCIONA');
  } catch (e) {
    console.log('✗ Patrón 4: new mailjetModule(apiKey, apiSecret) -', e.message);
  }

  console.log('\n');

} catch (error) {
  console.error('❌ Error al cargar node-mailjet:', error.message);
  console.error('\nAsegúrate de que está instalado:');
  console.error('  pnpm install node-mailjet');
}
