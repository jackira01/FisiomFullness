/**
 * Script de datos de prueba para la sección "Pregunta a un experto"
 *
 * Crea:
 *  - 1 usuario con rol "user"       → pregunta_usuario@fisiom.dev / Test1234!
 *  - 1 usuario con rol "professional" → profesional_experto@fisiom.dev / Test1234!
 *  - 10 preguntas (7 respondidas, 3 sin respuesta)
 *
 * Uso:
 *   cd api
 *   node seed-questions.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./src/models/User');
const Question = require('./src/models/Question');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI no está definida en .env');
  process.exit(1);
}

// ── Datos de los usuarios de prueba ──────────────────────────────────────────
const RAW_PASSWORD = 'Test1234!';

const SEED_USER = {
  email: 'pregunta_usuario@fisiom.dev',
  firstname: 'Carlos',
  lastname: 'Gómez',
  username: 'carlos_gomez_seed',
  role: 'user',
  confirm: true,
  emailVerified: new Date(),
  status: true,
};

const SEED_PROFESSIONAL = {
  email: 'profesional_experto@fisiom.dev',
  firstname: 'Laura',
  lastname: 'Martínez',
  username: 'laura_martinez_seed',
  role: 'professional',
  confirm: true,
  emailVerified: new Date(),
  status: true,
  specialty: 'Fisioterapia',
};

// ── Preguntas de prueba ───────────────────────────────────────────────────────
const QUESTION_TEXTS = [
  { text: '¿Cuántas sesiones de fisioterapia se necesitan para recuperar un esguince de tobillo?', answered: true },
  { text: '¿Es recomendable hacer ejercicio con dolor lumbar moderado?', answered: true },
  { text: '¿Cuál es la diferencia entre un fisioterapeuta y un kinesiólogo?', answered: true },
  { text: '¿Qué ejercicios puedo hacer en casa para fortalecer la rodilla?', answered: true },
  { text: '¿Cómo sé si necesito fisioterapia o simplemente reposo después de una lesión muscular?', answered: true },
  { text: '¿La electroterapia realmente ayuda a reducir el dolor crónico?', answered: true },
  { text: '¿Cuánto tiempo tarda en sanar una hernia discal con tratamiento conservador?', answered: true },
  { text: '¿Puedo nadar si tengo dolor en el manguito rotador?', answered: false },
  { text: '¿Es normal tener más dolor las primeras sesiones de fisioterapia?', answered: false },
  { text: '¿Existe tratamiento fisioterapéutico para la fibromialgia?', answered: false },
];

const ANSWER_TEXTS = [
  'Generalmente se necesitan entre 6 y 12 sesiones dependiendo del grado del esguince. Un esguince grado I puede resolverse en 3-4 semanas, mientras que uno grado III puede requerir hasta 3 meses de rehabilitación.',
  'Depende del tipo y la causa del dolor. En la mayoría de los casos, el movimiento moderado es beneficioso. Sin embargo, te recomiendo consultar antes con un profesional para descartar lesiones estructurales.',
  'Ambos trabajan la rehabilitación, pero difieren en formación y enfoque. El fisioterapeuta se especializa en terapia manual y electroterapia; el kinesiólogo tiene un enfoque más amplio en el movimiento humano. En muchos países los términos se usan indistintamente.',
  'Ejercicios recomendados: extensiones de cuádriceps en silla, sentadillas hasta 30°, puente de glúteos y trabajo de isquiotibiales con banda elástica. Empieza con 3 series de 15 repeticiones y aumenta progresivamente.',
  'Si el dolor persiste más de 72 horas, hay inflamación visible o limitación de movimiento, es momento de consultar a un fisioterapeuta. El reposo absoluto suele ser contraproducente luego de las primeras 48 horas.',
  'Sí, la electroterapia (TENS, ultrasonido, láser) ha demostrado eficacia en el dolor crónico. Funciona mejor como complemento de la terapia activa y no como tratamiento único.',
  'Con tratamiento conservador (fisioterapia + analgésicos + reposo relativo), entre el 80 y 90 % de los casos mejoran en 6 semanas. Los casos más severos pueden requerir hasta 3-6 meses.',
];

// ── Función principal ─────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Conectado a MongoDB');

  const hashedPassword = await bcrypt.hash(RAW_PASSWORD, 10);

  // Crear o actualizar usuario normal
  let seedUser = await User.findOne({ email: SEED_USER.email });
  if (seedUser) {
    console.log(`  · Usuario "${SEED_USER.email}" ya existe, se omite.`);
  } else {
    seedUser = await User.create({ ...SEED_USER, password: hashedPassword });
    console.log(`  ✓ Usuario creado: ${SEED_USER.email}  (contraseña: ${RAW_PASSWORD})`);
  }

  // Crear o actualizar profesional
  let seedProfessional = await User.findOne({ email: SEED_PROFESSIONAL.email });
  if (seedProfessional) {
    console.log(`  · Profesional "${SEED_PROFESSIONAL.email}" ya existe, se omite.`);
  } else {
    seedProfessional = await User.create({ ...SEED_PROFESSIONAL, password: hashedPassword });
    console.log(`  ✓ Profesional creado: ${SEED_PROFESSIONAL.email}  (contraseña: ${RAW_PASSWORD})`);
  }

  // Crear preguntas
  let created = 0;
  let answerIndex = 0;

  for (const q of QUESTION_TEXTS) {
    const existing = await Question.findOne({ text: q.text });
    if (existing) {
      console.log(`  · Pregunta ya existe, se omite: "${q.text.slice(0, 50)}..."`);
      continue;
    }

    const questionData = {
      text: q.text,
      userId: seedUser._id,
    };

    if (q.answered) {
      questionData.isAnswered = true;
      questionData.answer = {
        text: ANSWER_TEXTS[answerIndex % ANSWER_TEXTS.length],
        professionalId: seedProfessional._id,
      };
      answerIndex++;
    }

    await Question.create(questionData);
    created++;
  }

  console.log(`\n✓ Preguntas creadas: ${created}`);
  console.log('\n─────────────────────────────────────────────');
  console.log('Credenciales de acceso:');
  console.log(`  Usuario normal    → ${SEED_USER.email} / ${RAW_PASSWORD}`);
  console.log(`  Profesional       → ${SEED_PROFESSIONAL.email} / ${RAW_PASSWORD}`);
  console.log('─────────────────────────────────────────────\n');

  await mongoose.disconnect();
  console.log('✓ Desconectado de MongoDB');
}

main().catch((err) => {
  console.error('Error en seed:', err);
  mongoose.disconnect();
  process.exit(1);
});
