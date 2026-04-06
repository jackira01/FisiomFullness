/**
 * seed-professional-data.js
 * Populates all professional users with sample data:
 *   - description, experience (3-4 entries), isApproved
 *   - Services (4-5 per professional)
 *   - Ratings (6-8 per professional, from real regular users)
 *   - Recalculates rating.average and rating.count
 *
 * Usage: node seed-professional-data.js
 * Note: Deletes and re-creates services and ratings on each run.
 */

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const dotenv = require('dotenv');
dotenv.config();

const User = require('./src/models/User');
const Service = require('./src/models/Service');
const Rating = require('./src/models/Rating');

// ─── Connection ─────────────────────────────────────────────────────────────
const DB_URI =
  process.env.MONGODB_URI ||
  process.env.DB_URI;

// ─── Specialty data map ──────────────────────────────────────────────────────
const SPECIALTY_DATA = {
  'Rehabilitación deportiva': {
    description:
      'Especialista en recuperación y prevención de lesiones deportivas. Trabajo con atletas de todos los niveles aplicando técnicas de fisioterapia deportiva, electroestimulación y ejercicio terapéutico para lograr una reintegración segura y eficaz al deporte.',
    services: [
      {
        title: 'Evaluación inicial deportiva',
        description:
          'Valoración biomecánica completa del deportista, análisis funcional del movimiento e identificación de factores de riesgo. Incluye informe detallado y plan de acción.',
        price: 80,
        duration: 60,
      },
      {
        title: 'Rehabilitación post-lesión',
        description:
          'Plan personalizado de recuperación funcional con ejercicios progresivos, movilización articular y terapia manual enfocados en retornar al nivel deportivo previo.',
        price: 70,
        duration: 50,
      },
      {
        title: 'Prevención de lesiones',
        description:
          'Sesión de entrenamiento neuromuscular y fortalecimiento específico para reducir el riesgo de re-lesión en el deportista.',
        price: 60,
        duration: 45,
      },
      {
        title: 'Electroestimulación muscular (EMS)',
        description:
          'Aplicación de corrientes eléctricas para activar grupos musculares específicos, acelerar la recuperación y mejorar el rendimiento deportivo.',
        price: 55,
        duration: 40,
      },
      {
        title: 'Masaje deportivo',
        description:
          'Técnica de masaje profundo para preparar y recuperar los tejidos musculares antes y después del entrenamiento o competencia.',
        price: 65,
        duration: 45,
      },
    ],
    experience: [
      {
        title: 'Fisioterapeuta deportivo principal',
        company: 'Club Sporting Cristal',
        startDateMonth: 3,
        startDateYear: 2019,
        current: true,
        description:
          'Atención y recuperación de lesiones musculoesqueléticas en jugadores profesionales. Coordinación del programa de prevención de lesiones del plantel de primera y segunda división.',
      },
      {
        title: 'Fisioterapeuta de campo',
        company: 'Federación Peruana de Atletismo',
        startDateMonth: 1,
        startDateYear: 2016,
        endDateMonth: 2,
        endDateYear: 2019,
        current: false,
        description:
          'Acompañamiento médico en competencias nacionales e internacionales, evaluación funcional y tratamiento en campo para atletas de alto rendimiento.',
      },
      {
        title: 'Asistente de fisioterapia deportiva',
        company: 'Centro de Alto Rendimiento IPD',
        startDateMonth: 7,
        startDateYear: 2013,
        endDateMonth: 12,
        endDateYear: 2015,
        current: false,
        description:
          'Apoyo en la rehabilitación de deportistas nacionales. Gestión del área de fisioterapia durante torneos y eventos deportivos de nivel olímpico.',
      },
      {
        title: 'Pasante de investigación deportiva',
        company: 'Universidad Nacional Mayor de San Marcos',
        startDateMonth: 3,
        startDateYear: 2011,
        endDateMonth: 6,
        endDateYear: 2013,
        current: false,
        description:
          'Investigación sobre biomecánica del movimiento y lesiones deportivas frecuentes en adolescentes practicantes de fútbol y atletismo.',
      },
    ],
  },
  Fisioterapia: {
    description:
      'Fisioterapeuta general con amplia experiencia en el tratamiento del dolor, disfunciones musculoesqueléticas y rehabilitación funcional. Combino terapia manual, agentes físicos y ejercicio terapéutico para ofrecer un abordaje integral a mis pacientes.',
    services: [
      {
        title: 'Consulta de fisioterapia',
        description:
          'Evaluación completa del estado físico del paciente y elaboración de un plan de tratamiento individualizado con seguimiento continuo.',
        price: 65,
        duration: 60,
      },
      {
        title: 'Terapia manual',
        description:
          'Técnicas específicas de movilización articular y tisular para aliviar el dolor, restaurar la movilidad y mejorar la función musculoesquelética.',
        price: 75,
        duration: 50,
      },
      {
        title: 'Electroterapia y ultrasonido',
        description:
          'Aplicación de agentes físicos (TENS, ultrasonido, corrientes interferenciales) para reducir la inflamación, aliviar el dolor y acelerar la recuperación.',
        price: 55,
        duration: 40,
      },
      {
        title: 'Punción seca',
        description:
          'Técnica invasiva de fisioterapia que utiliza agujas de acupuntura para el tratamiento de puntos gatillo miofasciales y dolor crónico.',
        price: 90,
        duration: 45,
      },
      {
        title: 'Plan de rehabilitación mensual',
        description:
          'Paquete de 8 sesiones de fisioterapia personalizada con evaluación inicial y final, adaptado a la patología y objetivos del paciente.',
        price: 420,
        duration: 50,
      },
    ],
    experience: [
      {
        title: 'Fisioterapeuta clínico especialista',
        company: 'Clínica San Pablo',
        startDateMonth: 6,
        startDateYear: 2018,
        current: true,
        description:
          'Tratamiento de pacientes con patologías musculoesqueléticas, neurológicas y reumatológicas en consulta ambulatoria. Coordinación del equipo de rehabilitación.',
      },
      {
        title: 'Fisioterapeuta asistencial',
        company: 'Hospital Nacional Guillermo Almenara',
        startDateMonth: 2,
        startDateYear: 2015,
        endDateMonth: 5,
        endDateYear: 2018,
        current: false,
        description:
          'Rehabilitación de pacientes postoperatorios y con lesiones traumáticas en el servicio de medicina física y rehabilitación.',
      },
      {
        title: 'Fisioterapeuta domiciliario',
        company: 'FisioNet Perú',
        startDateMonth: 4,
        startDateYear: 2013,
        endDateMonth: 1,
        endDateYear: 2015,
        current: false,
        description:
          'Atención domiciliaria a pacientes con movilidad reducida, adultos mayores y pacientes postoperatorios que no podían desplazarse a centros de salud.',
      },
      {
        title: 'Voluntario en brigada de salud',
        company: 'Cruz Roja Peruana',
        startDateMonth: 1,
        startDateYear: 2012,
        endDateMonth: 3,
        endDateYear: 2013,
        current: false,
        description:
          'Atención fisioterapéutica a poblaciones vulnerables en zonas rurales andinas. Talleres de educación postural y prevención de lesiones ocupacionales.',
      },
    ],
  },
  Neurorehabilitación: {
    description:
      'Especializado en la rehabilitación de personas con alteraciones neurológicas como ACV, esclerosis múltiple, Parkinson y lesiones medulares. Utilizo técnicas actualizadas como Bobath, PNF y tecnología de biofeedback para maximizar la recuperación funcional.',
    services: [
      {
        title: 'Evaluación neurológica funcional',
        description:
          'Valoración detallada de capacidades motoras, sensitivas y cognitivas mediante escalas estandarizadas para orientar el plan de neurorrehabilitación.',
        price: 90,
        duration: 75,
      },
      {
        title: 'Sesión de neurorrehabilitación',
        description:
          'Aplicación de técnicas especializadas (Bobath, PNF, Vojta) para recuperar el control motor, equilibrio, coordinación y marcha.',
        price: 85,
        duration: 60,
      },
      {
        title: 'Rehabilitación de mano neurológica',
        description:
          'Tratamiento específico de la función de mano con ejercicios de destreza fina, sensibilidad y coordinación bimanual.',
        price: 80,
        duration: 60,
      },
      {
        title: 'Reeducación de la marcha',
        description:
          'Programa progresivo para recuperar o mejorar el patrón de marcha en pacientes con secuelas neurológicas, usando ortesis o ayudas técnicas si es necesario.',
        price: 85,
        duration: 60,
      },
      {
        title: 'Terapia de biofeedback',
        description:
          'Sesión de retroalimentación biológica mediante electromiografía o plataforma de equilibrio para trabajar el control motor y la propiocepción.',
        price: 100,
        duration: 50,
      },
    ],
    experience: [
      {
        title: 'Fisioterapeuta neurólogo senior',
        company: 'Instituto Nacional de Rehabilitación',
        startDateMonth: 4,
        startDateYear: 2017,
        current: true,
        description:
          'Rehabilitación de pacientes con secuelas neurológicas post ACV, TCE y enfermedades degenerativas del sistema nervioso central y periférico.',
      },
      {
        title: 'Investigador en neurorrehabilitación',
        company: 'PUCP – Departamento de Ciencias',
        startDateMonth: 8,
        startDateYear: 2014,
        endDateMonth: 3,
        endDateYear: 2017,
        current: false,
        description:
          'Participación en proyectos de investigación sobre plasticidad neuronal y técnicas de rehabilitación basadas en evidencia para patologías del SNC.',
      },
      {
        title: 'Fisioterapeuta en unidad de ACV',
        company: 'Hospital de la Solidaridad',
        startDateMonth: 3,
        startDateYear: 2012,
        endDateMonth: 7,
        endDateYear: 2014,
        current: false,
        description:
          'Atención temprana en la fase aguda y subaguda del ACV. Coordinación con equipo multidisciplinario para optimizar la recuperación funcional del paciente.',
      },
    ],
  },
  'Fisioterapia pediátrica': {
    description:
      'Fisioterapeuta dedicada al desarrollo motor y la rehabilitación de niños y adolescentes. Trabajo con bebés, niños con retrasos del desarrollo, parálisis cerebral y alteraciones musculoesqueléticas en un entorno lúdico y estimulante.',
    services: [
      {
        title: 'Evaluación del desarrollo motor',
        description:
          'Valoración integral del desarrollo neuromotor del niño con escalas estandarizadas (Bayley, AIMS) y análisis postural. Entrega de informe a la familia.',
        price: 75,
        duration: 60,
      },
      {
        title: 'Fisioterapia pediátrica',
        description:
          'Sesión terapéutica adaptada a cada niño, orientada a mejorar el tono muscular, el equilibrio, la coordinación y las habilidades motoras gruesas y finas.',
        price: 70,
        duration: 50,
      },
      {
        title: 'Estimulación temprana',
        description:
          'Intervención especializada en bebés de 0 a 3 años para potenciar el desarrollo psicomotor, sensorial y cognitivo en sus etapas críticas.',
        price: 65,
        duration: 45,
      },
      {
        title: 'Rehabilitación en parálisis cerebral',
        description:
          'Programa intensivo de abordaje neurofuncional mediante técnicas Bobath y Vojta para niños con diagnóstico de parálisis cerebral.',
        price: 85,
        duration: 60,
      },
      {
        title: 'Asesoría para padres y cuidadores',
        description:
          'Sesión de orientación y enseñanza a padres y cuidadores sobre técnicas de manejo postural, ejercicios en casa y actividades que favorecen el desarrollo del niño.',
        price: 50,
        duration: 45,
      },
    ],
    experience: [
      {
        title: 'Fisioterapeuta pediátrica',
        company: 'Hospital Nacional de Niños',
        startDateMonth: 1,
        startDateYear: 2020,
        current: true,
        description:
          'Tratamiento de niños con parálisis cerebral, síndrome de Down, retrasos del desarrollo y patologías ortopédicas pediátricas en consulta ambulatoria y hospitalización.',
      },
      {
        title: 'Terapeuta de estimulación temprana',
        company: 'Centro Ann Sullivan del Perú',
        startDateMonth: 5,
        startDateYear: 2017,
        endDateMonth: 12,
        endDateYear: 2019,
        current: false,
        description:
          'Atención de niños con NEE mediante programas individualizados de estimulación sensoriomotora, comunicación y habilidades de la vida diaria.',
      },
      {
        title: 'Fisioterapeuta en neonatología',
        company: 'Clínica Internacional',
        startDateMonth: 2,
        startDateYear: 2015,
        endDateMonth: 4,
        endDateYear: 2017,
        current: false,
        description:
          'Atención fisioterapéutica a neonatos prematuros y con patologías neonatales en UCI neonatal. Manejo postural y estimulación sensoriomotora temprana.',
      },
      {
        title: 'Docente auxiliar de fisioterapia pediátrica',
        company: 'Universidad Cayetano Heredia',
        startDateMonth: 3,
        startDateYear: 2013,
        endDateMonth: 1,
        endDateYear: 2015,
        current: false,
        description:
          'Docencia en el área de fisioterapia pediátrica y del neurodesarrollo para alumnos de pregrado. Supervisión de prácticas clínicas.',
      },
    ],
  },
  'Ortopedia y traumatología': {
    description:
      'Especialista en la rehabilitación postquirúrgica y conservadora de lesiones del sistema musculoesquelético. Acompaño a mis pacientes desde el alta médica hasta la recuperación completa de su funcionalidad, trabajando de manera coordinada con el equipo médico.',
    services: [
      {
        title: 'Rehabilitación postquirúrgica',
        description:
          'Programa de recuperación personalizado tras cirugías ortopédicas (prótesis de cadera o rodilla, reparación de ligamentos, artroscopias, etc.).',
        price: 90,
        duration: 60,
      },
      {
        title: 'Tratamiento de patologías crónicas',
        description:
          'Abordaje conservador de artrosis, tendinopatías y síndromes dolorosos crónicos mediante terapia manual y ejercicio terapéutico progresivo.',
        price: 75,
        duration: 55,
      },
      {
        title: 'Vendaje funcional y kinesiotaping',
        description:
          'Aplicación de técnicas de vendaje para estabilización articular, descarga de tejidos blandos y control del dolor en lesiones agudas y crónicas.',
        price: 50,
        duration: 30,
      },
      {
        title: 'Ondas de choque extracorpóreas',
        description:
          'Tratamiento no invasivo con ondas de presión para tendinopatías crónicas, fascitis plantar, calcificaciones y cicatrices resistentes.',
        price: 110,
        duration: 30,
      },
      {
        title: 'Pilates terapéutico',
        description:
          'Sesión de Pilates clínico adaptado para fortalecer el core, corregir desequilibrios posturales y mejorar la estabilidad en patologías de columna y pelvis.',
        price: 70,
        duration: 55,
      },
    ],
    experience: [
      {
        title: 'Fisioterapeuta ortopédico',
        company: 'Clínica Angloamericana',
        startDateMonth: 7,
        startDateYear: 2018,
        current: true,
        description:
          'Rehabilitación postquirúrgica de pacientes con reemplazos articulares, reconstrucciones ligamentarias y fracturas complejas. Coordinación con cirujanos ortopédicos.',
      },
      {
        title: 'Fisioterapeuta traumatológico',
        company: 'Hospital de Emergencias José Casimiro Ulloa',
        startDateMonth: 3,
        startDateYear: 2015,
        endDateMonth: 6,
        endDateYear: 2018,
        current: false,
        description:
          'Atención de urgencias traumatológicas y rehabilitación inicial en hospitalización. Gestión de la unidad de fisioterapia de urgencias.',
      },
      {
        title: 'Fisioterapeuta ortopédico junior',
        company: 'Clínica Ricardo Palma',
        startDateMonth: 8,
        startDateYear: 2012,
        endDateMonth: 2,
        endDateYear: 2015,
        current: false,
        description:
          'Rehabilitación ambulatoria de pacientes con patologías de columna vertebral, hombro y rodilla. Aplicación de técnicas de terapia manual y ejercicio.',
      },
    ],
  },
};

// Fallback for professionals without a matching specialty
const GENERIC_DATA = {
  description:
    'Profesional de la fisioterapia comprometido con el bienestar y la recuperación de sus pacientes. Aplica técnicas basadas en evidencia para mejorar la calidad de vida de quienes acuden a su consulta.',
  services: [
    {
      title: 'Evaluación fisioterapéutica',
      description:
        'Valoración completa del estado funcional del paciente y diseño de un plan de tratamiento personalizado.',
      price: 65,
      duration: 60,
    },
    {
      title: 'Sesión de fisioterapia',
      description:
        'Tratamiento fisioterapéutico integral adaptado a las necesidades de cada paciente.',
      price: 60,
      duration: 50,
    },
    {
      title: 'Terapia manual',
      description:
        'Movilización articular y técnicas miofasciales para reducir el dolor y recuperar la movilidad.',
      price: 70,
      duration: 50,
    },
    {
      title: 'Termoterapia y crioterapia',
      description:
        'Aplicación de calor y frío terapéutico para el manejo del dolor agudo y crónico y la reducción de la inflamación.',
      price: 45,
      duration: 30,
    },
  ],
  experience: [
    {
      title: 'Fisioterapeuta',
      company: 'Centro Fisiomfulness',
      startDateMonth: 1,
      startDateYear: 2020,
      current: true,
      description:
        'Atención de pacientes con diversas patologías musculoesqueléticas y neurológicas. Participación en programas de bienestar corporativo.',
    },
    {
      title: 'Residente de fisioterapia',
      company: 'Hospital Nacional Dos de Mayo',
      startDateMonth: 4,
      startDateYear: 2017,
      endDateMonth: 12,
      endDateYear: 2019,
      current: false,
      description:
        'Rotación por los servicios de trauma, neurología, reumatología y medicina física durante la residencia clínica.',
    },
    {
      title: 'Instructor de ejercicio terapéutico',
      company: 'Gym & Rehab Center',
      startDateMonth: 2,
      startDateYear: 2015,
      endDateMonth: 3,
      endDateYear: 2017,
      current: false,
      description:
        'Diseño y supervisión de programas de ejercicio terapéutico para personas con enfermedades crónicas y adultos mayores.',
    },
  ],
};

// ─── Sample review texts ──────────────────────────────────────────────────────
const REVIEWS = [
  {
    score: 5,
    description:
      'Excelente profesional. Me ayudó a recuperarme de mi lesión en tiempo récord. Muy recomendado.',
  },
  {
    score: 5,
    description:
      'Muy atento y dedicado. Explica cada procedimiento con claridad y los resultados se notan desde la primera sesión.',
  },
  {
    score: 4,
    description:
      'Gran profesional. Se nota que domina su especialidad y está siempre dispuesto a resolver dudas.',
  },
  {
    score: 5,
    description:
      'Superó mis expectativas. El tratamiento fue muy efectivo y el trato humano excelente.',
  },
  {
    score: 4,
    description:
      'Muy buenas sesiones. Noté mejoría desde el comienzo y el ambiente del consultorio es muy agradable.',
  },
  {
    score: 5,
    description:
      'Es de los mejores profesionales que he visitado. Sabe escuchar y su diagnóstico fue muy preciso.',
  },
  {
    score: 3,
    description:
      'Buen profesional aunque a veces las sesiones se extienden un poco. Los resultados igual son buenos.',
  },
  {
    score: 5,
    description:
      'Increíble experiencia. Muy profesional y los avances en mi rehabilitación fueron notables.',
  },
  {
    score: 4,
    description:
      'Recomiendo ampliamente sus servicios. El tratamiento fue exactamente lo que necesitaba y se nota la experiencia.',
  },
  {
    score: 5,
    description:
      'Excelente atención desde el primer día. Me explicó todo el proceso y siempre estuvo pendiente de mi evolución.',
  },
  {
    score: 4,
    description:
      'Profesional muy competente y amable. Las técnicas que utiliza son modernas y se adaptan bien a cada caso.',
  },
  {
    score: 5,
    description:
      'Vine con un dolor crónico de espalda que tenía hace años y gracias a su tratamiento logré recuperarme. Muy agradecido.',
  },
  {
    score: 3,
    description:
      'Buen trato y conocimiento técnico. Me hubiera gustado tener más tiempo de consulta, pero el servicio es de calidad.',
  },
  {
    score: 5,
    description:
      'Muy buena atención y explicaciones claras. Se notó la mejoría desde las primeras sesiones. Totalmente recomendado.',
  },
  {
    score: 4,
    description:
      'Profesional comprometido con la recuperación del paciente. El consultorio está bien equipado y el ambiente es muy tranquilo.',
  },
  {
    score: 5,
    description:
      'Llevé a mi hijo con una lesión en el tobillo y quedó muy bien. El profesional fue muy paciente y supo cómo tratar a un chico joven.',
  },
  {
    score: 4,
    description:
      'Muy buena comunicación durante todo el proceso. Siempre explicó qué hacía y por qué, lo cual me dio mucha confianza.',
  },
  {
    score: 5,
    description:
      'Me operaron de rodilla y el proceso de rehabilitación con este profesional fue impecable. Recuperé la movilidad más rápido de lo esperado.',
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
const newId = () => new ObjectId().toString();

const recalculateRating = async (professionalId) => {
  const ratings = await Rating.find({
    professionalId,
    status: true,
  }).select('score');

  const count = ratings.length;
  const average =
    count > 0
      ? Math.round((ratings.reduce((s, r) => s + r.score, 0) / count) * 10) /
      10
      : 0;

  await User.findByIdAndUpdate(professionalId, {
    'rating.average': average,
    'rating.count': count,
  });
};

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(DB_URI);
  console.log('✅ Connected to MongoDB');

  // Get all professionals
  const professionals = await User.find({ role: 'professional' });
  console.log(`Found ${professionals.length} professional(s)`);

  // Get regular users to post reviews
  const regularUsers = await User.find({ role: 'user' }).limit(20);
  if (regularUsers.length < 2) {
    console.warn('⚠️  Less than 2 regular users found. Reviews may be limited.');
  }

  for (const prof of professionals) {
    console.log(`\n→ Seeding: ${prof.firstname} ${prof.lastname} (${prof._id})`);

    // Determine specialty key
    const specName = prof.specialties?.[0]?.name || prof.specialty || '';
    const data = SPECIALTY_DATA[specName] || GENERIC_DATA;

    // 1. Update professional base data (experience + description + isApproved)
    const experienceWithIds = data.experience.map((exp) => ({
      _id: newId(),
      ...exp,
    }));

    await User.findByIdAndUpdate(prof._id, {
      description: data.description,
      experience: experienceWithIds,
      isApproved: true,
    });
    console.log(`  ✓ Profile updated (${experienceWithIds.length} experience entries)`);

    // 2. Delete existing services and re-create them
    await Service.deleteMany({ professionalId: prof._id });
    const serviceDocs = data.services.map((s) => ({
      _id: newId(),
      professionalId: prof._id,
      ...s,
    }));
    await Service.insertMany(serviceDocs);
    console.log(`  ✓ Services re-created (${serviceDocs.length})`);

    // 3. Delete existing ratings and re-create with more reviewers
    await Rating.deleteMany({ professionalId: prof._id });

    if (regularUsers.length > 0) {
      // Use up to 8 reviewers, rotating through REVIEWS array with offset per professional
      const profIndex = professionals.indexOf(prof);
      const shuffled = [...regularUsers].sort(() => Math.random() - 0.5);
      const reviewers = shuffled.slice(0, Math.min(8, shuffled.length));

      const ratingDocs = reviewers.map((user, idx) => {
        const review = REVIEWS[(profIndex * 3 + idx) % REVIEWS.length];
        return {
          _id: newId(),
          professionalId: prof._id,
          _professional: prof._id,
          userId: user._id,
          _user: user._id,
          score: review.score,
          description: review.description,
          status: true,
        };
      });

      await Rating.insertMany(ratingDocs);
      console.log(`  ✓ Ratings re-created (${ratingDocs.length})`);

      await recalculateRating(prof._id);
      const updated = await User.findById(prof._id).select('rating');
      console.log(
        `  ✓ Rating recalculated: avg=${updated.rating.average} count=${updated.rating.count}`
      );
    } else {
      console.log('  ↷ No regular users available to post reviews');
    }
  }

  console.log('\n✅ Seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
