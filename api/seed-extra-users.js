/**
 * Script para crear 10 usuarios adicionales (5 comunes + 5 profesionales)
 *
 * Uso:
 *   cd api
 *   node seed-extra-users.js
 *
 * Contraseña para todos: Test1234!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./src/models/User');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI no está definida en .env');
  process.exit(1);
}

const RAW_PASSWORD = 'Test1234!';

const EXTRA_USERS = [
  // ── 5 usuarios comunes ──────────────────────────────────────────────────────
  {
    email: 'sofia_ramirez@fisiom.dev',
    firstname: 'Sofía',
    lastname: 'Ramírez',
    username: 'sofia_ramirez_seed',
    role: 'user',
  },
  {
    email: 'andres_perez@fisiom.dev',
    firstname: 'Andrés',
    lastname: 'Pérez',
    username: 'andres_perez_seed',
    role: 'user',
  },
  {
    email: 'valentina_torres@fisiom.dev',
    firstname: 'Valentina',
    lastname: 'Torres',
    username: 'valentina_torres_seed',
    role: 'user',
  },
  {
    email: 'miguel_herrera@fisiom.dev',
    firstname: 'Miguel',
    lastname: 'Herrera',
    username: 'miguel_herrera_seed',
    role: 'user',
  },
  {
    email: 'camila_vargas@fisiom.dev',
    firstname: 'Camila',
    lastname: 'Vargas',
    username: 'camila_vargas_seed',
    role: 'user',
  },
  // ── 5 profesionales ─────────────────────────────────────────────────────────
  {
    email: 'dr_juan_ospina@fisiom.dev',
    firstname: 'Juan',
    lastname: 'Ospina',
    username: 'dr_juan_ospina_seed',
    role: 'professional',
    specialty: 'Rehabilitación deportiva',
  },
  {
    email: 'dra_maria_castro@fisiom.dev',
    firstname: 'María',
    lastname: 'Castro',
    username: 'dra_maria_castro_seed',
    role: 'professional',
    specialty: 'Fisioterapia',
  },
  {
    email: 'dr_nicolas_rios@fisiom.dev',
    firstname: 'Nicolás',
    lastname: 'Ríos',
    username: 'dr_nicolas_rios_seed',
    role: 'professional',
    specialty: 'Neurorehabilitación',
  },
  {
    email: 'dra_diana_morales@fisiom.dev',
    firstname: 'Diana',
    lastname: 'Morales',
    username: 'dra_diana_morales_seed',
    role: 'professional',
    specialty: 'Fisioterapia pediátrica',
  },
  {
    email: 'dr_felipe_cardona@fisiom.dev',
    firstname: 'Felipe',
    lastname: 'Cardona',
    username: 'dr_felipe_cardona_seed',
    role: 'professional',
    specialty: 'Ortopedia y traumatología',
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Conectado a MongoDB\n');

  const hashedPassword = await bcrypt.hash(RAW_PASSWORD, 10);

  let created = 0;
  let skipped = 0;

  for (const userData of EXTRA_USERS) {
    const exists = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] });
    if (exists) {
      console.log(`  · Ya existe: ${userData.email} — omitido`);
      skipped++;
      continue;
    }

    await User.create({
      ...userData,
      password: hashedPassword,
      confirm: true,
      emailVerified: new Date(),
      status: true,
    });

    const label = userData.role === 'professional' ? `[PROFESIONAL]` : `[USUARIO]    `;
    console.log(`  ✓ ${label} ${userData.firstname} ${userData.lastname} → ${userData.email}`);
    created++;
  }

  console.log(`\n─────────────────────────────────────────────`);
  console.log(`Creados: ${created}  |  Omitidos (ya existían): ${skipped}`);
  console.log(`Contraseña para todos: ${RAW_PASSWORD}`);
  console.log(`─────────────────────────────────────────────\n`);

  await mongoose.disconnect();
  console.log('✓ Desconectado de MongoDB');
}

main().catch((err) => {
  console.error('Error en seed:', err);
  mongoose.disconnect();
  process.exit(1);
});
