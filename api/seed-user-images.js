/**
 * Script para asignar imágenes de perfil a los usuarios semilla.
 * Usa URLs de randomuser.me (fotos reales de personas por género).
 *
 * Uso:
 *   cd api
 *   node seed-user-images.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI no está definida en .env');
  process.exit(1);
}

// Fotos reales de hombres desde randomuser.me (índices 1-99 disponibles)
const menPhotos = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/men/71.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/men/55.jpg',
];

// Fotos reales de mujeres desde randomuser.me
const womenPhotos = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/women/17.jpg',
  'https://randomuser.me/api/portraits/women/33.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
];

// Mapa: email del usuario → URL de imagen
const IMAGE_MAP = {
  // ── seed-questions.js ────────────────────────────────────────────────────
  'pregunta_usuario@fisiom.dev': 'https://randomuser.me/api/portraits/men/12.jpg',   // Carlos Gómez
  'profesional_experto@fisiom.dev': 'https://randomuser.me/api/portraits/women/57.jpg', // Laura Martínez

  // ── seed-extra-users.js ──────────────────────────────────────────────────
  'sofia_ramirez@fisiom.dev': womenPhotos[0], // Sofía Ramírez
  'andres_perez@fisiom.dev': menPhotos[0],   // Andrés Pérez
  'valentina_torres@fisiom.dev': womenPhotos[1], // Valentina Torres
  'miguel_herrera@fisiom.dev': menPhotos[1],   // Miguel Herrera
  'camila_vargas@fisiom.dev': womenPhotos[2], // Camila Vargas
  'dr_juan_ospina@fisiom.dev': menPhotos[2],   // Juan Ospina
  'dra_maria_castro@fisiom.dev': womenPhotos[3], // María Castro
  'dr_nicolas_rios@fisiom.dev': menPhotos[3],   // Nicolás Ríos
  'dra_diana_morales@fisiom.dev': womenPhotos[4], // Diana Morales
  'dr_felipe_cardona@fisiom.dev': menPhotos[4],   // Felipe Cardona
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Conectado a MongoDB\n');

  let updated = 0;
  let notFound = 0;

  for (const [email, imageUrl] of Object.entries(IMAGE_MAP)) {
    const result = await User.updateOne({ email }, { $set: { image: imageUrl } });
    if (result.matchedCount === 0) {
      console.log(`  ✗ No encontrado: ${email}`);
      notFound++;
    } else {
      console.log(`  ✓ ${email}`);
      updated++;
    }
  }

  console.log(`\n─────────────────────────────────────────────`);
  console.log(`Actualizados: ${updated}  |  No encontrados: ${notFound}`);
  console.log(`─────────────────────────────────────────────\n`);

  await mongoose.disconnect();
  console.log('✓ Desconectado de MongoDB');
}

main().catch((err) => {
  console.error('Error:', err);
  mongoose.disconnect();
  process.exit(1);
});
