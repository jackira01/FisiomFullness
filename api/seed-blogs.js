/**
 * Seed script para crear blogs de prueba en la BD.
 * Uso: node seed-blogs.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

// IDs de Types existentes en la DB
const TYPES = {
  rehabilitacion: '69b4a9bbcb2e79d3f740d5a0',
  traumatologica: '69b4a9ebcb2e79d3f740d5a2',
  deportiva: '69b4a9f0cb2e79d3f740d5a4',
  neurologica: '69b4a9f4cb2e79d3f740d5a6',
  respiratoria: '69b4a9f8cb2e79d3f740d5a8',
  geriatrica: '69b4a9fdcb2e79d3f740d5aa',
  pediatrica: '69b4aa00cb2e79d3f740d5ac',
};

// IDs de profesionales existentes en la DB
const PROFESSIONALS = [
  '69b97d2f5fade9fe4dadc2e6',
  '69b9fad605d0fa3f77d8567d',
];

// Imágenes de Unsplash (licencia libre) relacionadas con fisioterapia
const BLOGS = [
  {
    title: 'Beneficios del estiramiento diario en la prevención de lesiones',
    text: `<p>El estiramiento es una de las prácticas más subestimadas en el cuidado del cuerpo. Realizar una rutina de estiramientos de al menos 10 minutos al día puede marcar una diferencia significativa en la movilidad articular y en la prevención de lesiones musculares.</p>
<p>Cuando los músculos permanecen en estado de rigidez prolongada, se vuelven más susceptibles a micro-desgarros que, con el tiempo, pueden derivar en lesiones crónicas. El estiramiento regular mejora la elasticidad del tejido conjuntivo, aumenta el rango de movimiento y facilita una mejor circulación sanguínea en los grupos musculares trabajados.</p>
<p>Algunos de los estiramientos más recomendados para el día a día incluyen:</p>
<ul>
  <li><strong>Estiramiento de isquiotibiales:</strong> fundamental para quienes permanecen sentados muchas horas.</li>
  <li><strong>Rotación torácica:</strong> ayuda a contrarrestar la postura encorvada frente al computador.</li>
  <li><strong>Apertura de cadera:</strong> alivia la tensión en la zona lumbar y glúteos.</li>
</ul>
<p>La constancia es la clave. Incorporar estos movimientos a la rutina matutina o antes de dormir puede cambiar profundamente la calidad de vida y reducir las visitas al fisioterapeuta por dolores innecesarios.</p>`,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    id_image: 'unsplash_stretching_001',
    type_id: TYPES.deportiva,
    createBy: PROFESSIONALS[0],
  },
  {
    title: 'Rehabilitación post-quirúrgica: etapas y expectativas reales',
    text: `<p>Una cirugía ortopédica marca el comienzo, no el final, de un proceso de recuperación que puede extenderse varios meses. Conocer las etapas de la rehabilitación post-quirúrgica ayuda a gestionar las expectativas y a comprometerse con el tratamiento sin frustraciones.</p>
<p><strong>Fase 1 – Control del dolor e inflamación (primeras 2 semanas):</strong> El objetivo es reducir el dolor mediante crioterapia, reposo activo y movilizaciones suaves. No se busca fuerza en esta etapa.</p>
<p><strong>Fase 2 – Recuperación del rango de movimiento (semanas 2 a 6):</strong> Se introduce la movilización progresiva de la articulación. El trabajo con el fisioterapeuta es intensivo y puede resultar incómodo, pero respetando los límites del dolor.</p>
<p><strong>Fase 3 – Fortalecimiento muscular (semanas 6 a 12):</strong> Una vez recuperada la movilidad, se trabaja la musculatura de soporte para proteger la articulación intervenida.</p>
<p><strong>Fase 4 – Retorno a la actividad (a partir del mes 3):</strong> Se valora el alta progresiva a actividades cotidianas y deportivas según la evolución individual.</p>
<p>La adherencia al protocolo de rehabilitación es el factor predictor más importante de buenos resultados. Saltarse sesiones o avanzar fases sin autorización puede comprometer el resultado final de la cirugía.</p>`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    id_image: 'unsplash_rehab_002',
    type_id: TYPES.rehabilitacion,
    createBy: PROFESSIONALS[1],
  },
  {
    title: 'Fisioterapia neurológica: qué esperar después de un ACV',
    text: `<p>Un accidente cerebrovascular (ACV) puede dejar secuelas motoras, del habla o cognitivas que impactan profundamente la vida del paciente y su familia. La fisioterapia neurológica es fundamental en el proceso de neuro-rehabilitación, aprovechando la plasticidad cerebral para recuperar funciones perdidas.</p>
<p>El cerebro tiene una capacidad extraordinaria de reorganizarse tras una lesión. Esto se logra a través de la repetición intensiva y específica de movimientos que estimulan las redes neuronales dañadas o activan vías alternativas.</p>
<p>Las técnicas más utilizadas en fisioterapia neurológica incluyen:</p>
<ul>
  <li><strong>Concepto Bobath:</strong> trabajo del tono muscular y patrones de movimiento anormales.</li>
  <li><strong>Terapia de movimiento inducido por restricción (CIMT):</strong> fuerza el uso del miembro afectado restringiendo el sано.</li>
  <li><strong>Estimulación eléctrica funcional (FES):</strong> activa músculos paralizados mediante impulsos eléctricos controlados.</li>
  <li><strong>Realidad virtual y robótica:</strong> tecnologías emergentes con evidencia creciente en neurorehabilitación.</li>
</ul>
<p>El inicio temprano de la rehabilitación —idealmente dentro de las primeras 24-48 horas tras estabilización médica— está directamente asociado a mejores resultados funcionales a largo plazo.</p>`,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
    id_image: 'unsplash_neuro_003',
    type_id: TYPES.neurologica,
    createBy: PROFESSIONALS[0],
  },
  {
    title: 'Dolor lumbar: causas comunes y cómo abordarlo desde la fisioterapia',
    text: `<p>El dolor lumbar es la primera causa de discapacidad laboral en el mundo y afecta al 80% de las personas en algún momento de su vida. Sin embargo, en la mayoría de los casos no existe una patología grave subyacente y el tratamiento fisioterapéutico ofrece resultados excelentes.</p>
<p>Las causas más frecuentes del dolor lumbar inespecífico incluyen la tensión muscular por malas posturas, la debilidad del core (músculos estabilizadores del tronco), el sedentarismo y el estrés crónico que genera hipertonía muscular.</p>
<p>El enfoque fisioterapéutico moderno basado en evidencia rechaza el reposo absoluto y apuesta por el movimiento activo y controlado. Las intervenciones más efectivas son:</p>
<ul>
  <li>Ejercicio terapéutico centrado en fortalecimiento del core y cadena posterior.</li>
  <li>Terapia manual incluyendo movilizaciones vertebrales y liberación miofascial.</li>
  <li>Educación en neurociencia del dolor para cambiar la percepción de amenaza del paciente.</li>
  <li>Corrección ergonómica del puesto de trabajo y hábitos posturales.</li>
</ul>
<p>La combinación de ejercicio y educación al paciente ha demostrado ser superior a cualquier tratamiento pasivo aislado. El objetivo es devolver al paciente la confianza en su cuerpo y reducir el miedo al movimiento.</p>`,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    id_image: 'unsplash_lumbar_004',
    type_id: TYPES.traumatologica,
    createBy: PROFESSIONALS[1],
  },
  {
    title: 'Fisioterapia respiratoria: aliada clave en enfermedades pulmonares',
    text: `<p>La fisioterapia respiratoria es una especialidad que trabaja con técnicas orientadas a mejorar la ventilación pulmonar, facilitar la eliminación de secreciones y aumentar la resistencia al ejercicio en pacientes con patologías como EPOC, asma, fibrosis quística o secuelas post-COVID.</p>
<p>Después de la pandemia, la demanda de fisioterapia respiratoria aumentó considerablemente. Muchos pacientes recuperados de COVID-19 persistente presentan disnea, fatiga y reducción de la capacidad aeróbica que requieren rehabilitación pulmonar especializada.</p>
<p>Las técnicas más utilizadas incluyen:</p>
<ul>
  <li><strong>Drenaje autógeno:</strong> serie de respiraciones controladas a diferentes volúmenes para movilizar las secreciones desde la periferia al centro del árbol bronquial.</li>
  <li><strong>Ejercicios de respiración diafragmática:</strong> mejoran la eficiencia ventilatoria y reducen el trabajo respiratorio.</li>
  <li><strong>Entrenamiento de la musculatura inspiratoria:</strong> mediante dispositivos de umbral de presión como el Threshold IMT.</li>
  <li><strong>Rehabilitación cardiovascular integrada:</strong> ejercicio aeróbico progresivo adaptado a la tolerancia del paciente.</li>
</ul>
<p>Un programa de rehabilitación respiratoria de 8 semanas puede mejorar significativamente la calidad de vida, reducir hospitalizaciones y recuperar la independencia funcional en pacientes con enfermedad pulmonar crónica.</p>`,
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
    id_image: 'unsplash_respiratory_005',
    type_id: TYPES.respiratoria,
    createBy: PROFESSIONALS[0],
  },
  {
    title: 'Fisioterapia en adultos mayores: mantener la autonomía con movimiento',
    text: `<p>El envejecimiento trae consigo cambios fisiológicos inevitables: pérdida de masa muscular (sarcopenia), reducción de la densidad ósea, disminución del equilibrio y enlentecimiento de los reflejos. Sin embargo, estos cambios no son un destino inmutable. La fisioterapia geriátrica tiene el potencial de retrasar, compensar y en algunos casos revertir parte de este declive funcional.</p>
<p>El mayor miedo en los adultos mayores son las caídas. Una caída puede desencadenar una fractura de cadera con consecuencias devastadoras para la independencia y longevidad. El trabajo fisioterapéutico enfocado en equilibrio y propiocepción es la intervención más efectiva para prevenir caídas.</p>
<p>Los pilares del tratamiento geriátrico incluyen:</p>
<ul>
  <li><strong>Entrenamiento de fuerza progresivo:</strong> contrarrestar la sarcopenia con ejercicios de resistencia adaptados.</li>
  <li><strong>Trabajo de equilibrio y coordinación:</strong> plataformas inestables, ejercicios unipodales y estimulación propioceptiva.</li>
  <li><strong>Marcha terapéutica:</strong> corrección del patrón de marcha para mayor seguridad y eficiencia.</li>
  <li><strong>Estimulación cognitivo-motora:</strong> ejercicios duales que trabajan simultáneamente movimiento y función cognitiva.</li>
</ul>
<p>Nunca es demasiado tarde para comenzar. Estudios demuestran ganancias funcionales significativas en personas mayores de 80 años que inician programas de ejercicio supervisado.</p>`,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    id_image: 'unsplash_geriatric_006',
    type_id: TYPES.geriatrica,
    createBy: PROFESSIONALS[1],
  },
  {
    title: 'Lesiones deportivas más frecuentes y cómo prevenirlas',
    text: `<p>El deporte es salud, pero practicado sin una preparación adecuada puede convertirse en fuente de lesiones. Conocer las lesiones más frecuentes según la disciplina y adoptar medidas preventivas marca la diferencia entre una temporada exitosa y meses de recuperación.</p>
<p>Las lesiones más comunes en el deporte amateur y de alto rendimiento son:</p>
<ul>
  <li><strong>Esguince de tobillo:</strong> la lesión más frecuente en deportes de cancha. Ocurre por inversión forzada del pie y afecta principalmente el ligamento peroneoastragalino anterior.</li>
  <li><strong>Tendinopatía rotuliana:</strong> muy común en deportes de salto como el voleibol y el baloncesto. Se manifiesta como dolor anterior de rodilla.</li>
  <li><strong>Lesión del manguito rotador:</strong> frecuente en natación, béisbol y deportes de lanzamiento por el movimiento repetitivo de hombro.</li>
  <li><strong>Fascitis plantar:</strong> sobrecarga del arco plantar típica en corredores con alto volumen de entrenamiento.</li>
</ul>
<p>La prevención pasa por un calentamiento adecuado, progresión gradual de las cargas de entrenamiento, trabajo de fuerza compensatorio, recuperación óptima entre sesiones y valoración periódica por un fisioterapeuta deportivo que identifique desequilibrios antes de que se conviertan en lesiones.</p>`,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    id_image: 'unsplash_sport_007',
    type_id: TYPES.deportiva,
    createBy: PROFESSIONALS[0],
  },
  {
    title: 'Fisioterapia pediátrica: detección temprana y tratamiento en niños',
    text: `<p>La fisioterapia pediátrica abarca desde recién nacidos hasta adolescentes y trabaja sobre un espectro muy amplio de condiciones: retrasos en el desarrollo motor, tortícolis congénita, escoliosis, parálisis cerebral, enfermedades neuromusculares y secuelas de traumatismos, entre muchas otras.</p>
<p>La detección temprana es fundamental. El cerebro infantil tiene una plasticidad extraordinaria durante los primeros años de vida, y intervenir en ese período ventana maximiza las posibilidades de desarrollo y compensación funcional.</p>
<p>Las señales de alerta que deben motivar una consulta de fisioterapia pediátrica incluyen:</p>
<ul>
  <li>No sostener la cabeza erguida a los 4 meses.</li>
  <li>No sentarse sin apoyo a los 9 meses.</li>
  <li>No caminar a los 18 meses.</li>
  <li>Asimetría en los movimientos de los miembros.</li>
  <li>Marcha de puntillas persistente más allá de los 3 años.</li>
</ul>
<p>El tratamiento en pediatría siempre se enmarca dentro del juego y la motivación del niño. La familia juega un papel fundamental al integrar los ejercicios terapéuticos en la rutina cotidiana del hogar, potenciando los resultados obtenidos en la consulta.</p>`,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    id_image: 'unsplash_pediatric_008',
    type_id: TYPES.pediatrica,
    createBy: PROFESSIONALS[1],
  },
  {
    title: 'Ergonomía en el teletrabajo: cómo proteger tu cuerpo desde casa',
    text: `<p>La masificación del teletrabajo ha traído consigo un aumento exponencial de las consultas por cervicalgia, dorsalgia y síndrome del túnel carpiano. La improvisación del puesto de trabajo en casa —sofás, camas, mesas de comedor— somete al aparato musculoesquelético a cargas mantenidas para las que no está diseñado.</p>
<p>Un puesto de trabajo ergonómico no requiere una inversión enorme, pero sí requiere conocimiento. Los principios básicos son:</p>
<ul>
  <li><strong>Altura del monitor:</strong> el borde superior de la pantalla debe estar a la altura de los ojos para evitar la flexión mantenida del cuello.</li>
  <li><strong>Posición de la silla:</strong> cadera y rodillas a 90°, pies apoyados en el suelo. La zona lumbar debe estar en contacto con el respaldo.</li>
  <li><strong>Posición del teclado y ratón:</strong> codos a 90° con los antebrazos apoyados en la mesa, muñecas neutras.</li>
  <li><strong>Regla 20-20-20 para la vista:</strong> cada 20 minutos mirar a un punto a 20 pies (6 metros) durante 20 segundos.</li>
  <li><strong>Microdescansos activos:</strong> levantarse y moverse al menos 2 minutos cada hora.</li>
</ul>
<p>Si ya tienes síntomas como tensión cervical, dolor de cabeza tensional o hormigueo en las manos, no los normalices. Un fisioterapeuta puede evaluar tu caso y orientarte tanto en el tratamiento como en la corrección del entorno de trabajo.</p>`,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    id_image: 'unsplash_ergonomic_009',
    type_id: TYPES.rehabilitacion,
    createBy: PROFESSIONALS[0],
  },
  {
    title: 'Vendaje neuromuscular (kinesiotaping): mitos y realidades',
    text: `<p>El vendaje neuromuscular o kinesiotaping ha ganado enorme popularidad en los últimos años, visible en los cuerpos de atletas olímpicos con cintas de colores llamativos. Pero, ¿qué hay de cierto detrás de esta técnica? ¿Es realmente efectiva o se trata de un efecto placebo colorido?</p>
<p>La evidencia científica actual indica que el kinesiotaping tiene efectos reales pero modestos en comparación con otras intervenciones fisioterapéuticas. Sus principales mecanismos de acción propuestos son la estimulación de mecanorreceptores cutáneos (que modula la percepción del dolor), la mejora de la drenaje linfático y la facilitación o inhibición de grupos musculares específicos según la dirección de aplicación.</p>
<p>Donde el kinesiotaping muestra mayor utilidad clínica:</p>
<ul>
  <li>Linfedema y hematomas post-traumáticos para facilitar el drenaje.</li>
  <li>Corrección postural de hombro en pacientes con ACV.</li>
  <li>Manejo del dolor en tendinopatías y fasciitis plantar como coadyuvante.</li>
  <li>Apoyo propioceptivo en esguinces de tobillo en proceso de alta.</li>
</ul>
<p>Lo que el kinesiotaping <strong>no puede hacer:</strong> estabilizar una articulación de manera significativa, igual que ocurre con el vendaje funcional, ni sustituir el ejercicio terapéutico como tratamiento principal. Úsalo como complemento, nunca como la única intervención.</p>`,
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800&q=80',
    id_image: 'unsplash_kinesio_010',
    type_id: TYPES.deportiva,
    createBy: PROFESSIONALS[1],
  },
  {
    title: 'Suelo pélvico: la fisioterapia que nadie te contó',
    text: `<p>El suelo pélvico es un conjunto de músculos, ligamentos y fascias que forma el piso de la cavidad abdomino-pélvica, dando soporte a los órganos pélvicos (vejiga, útero, recto) y participando en el control de la continencia urinaria y fecal, la función sexual y la estabilización del tronco.</p>
<p>La fisioterapia de suelo pélvico sigue siendo una especialidad poco conocida y rodeada de tabúes, pese a tratar condiciones que afectan a millones de personas de todos los géneros y edades. Las condiciones más frecuentemente tratadas son:</p>
<ul>
  <li><strong>Incontinencia urinaria de esfuerzo:</strong> pérdida involuntaria de orina al toser, estornudar o saltar. Afecta al 30-40% de las mujeres en algún momento de su vida.</li>
  <li><strong>Disfunción sexual:</strong> vaginismo, dispareunia (dolor en las relaciones), disfunción eréctil de componente muscular.</li>
  <li><strong>Prolapso de órganos pélvicos:</strong> descenso de vejiga, útero o recto por pérdida de soporte.</li>
  <li><strong>Dolor pélvico crónico:</strong> síndrome de vejiga hiperactiva, vulvodinia, endometriosis.</li>
  <li><strong>Rehabilitación postparto:</strong> recuperación del suelo pélvico tras el parto vaginal o cesárea.</li>
</ul>
<p>El tratamiento incluye ejercicios específicos de activación y relajación muscular, biofeedback electromiográfico y técnicas manuales internas y externas. Los resultados son altamente satisfactorios cuando el diagnóstico y tratamiento son realizados por un fisioterapeuta especializado.</p>`,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    id_image: 'unsplash_pelvic_011',
    type_id: TYPES.rehabilitacion,
    createBy: PROFESSIONALS[0],
  },
  {
    title: 'Hidroterapia y aquafisio: los beneficios del agua en la recuperación',
    text: `<p>El agua es el medio terapéutico más antiguo de la humanidad. Las propiedades físicas del agua —flotabilidad, resistencia, presión hidrostática y temperatura— crean un entorno ideal para la rehabilitación de pacientes que no toleran el ejercicio en tierra por dolor, carga o inestabilidad articular.</p>
<p>La hidroterapia está especialmente indicada en:</p>
<ul>
  <li><strong>Artritis y artrosis:</strong> la flotabilidad reduce hasta un 90% la carga sobre las articulaciones, permitiendo movimientos imposibles en tierra sin dolor.</li>
  <li><strong>Fibromialgia:</strong> el agua caliente relaja la musculatura y el ambiente acuático facilita el ejercicio aeróbico de baja intensidad que estos pacientes necesitan.</li>
  <li><strong>Rehabilitación postquirúrgica precoz:</strong> permite iniciar trabajo funcional antes de que la articulación soporte carga completa.</li>
  <li><strong>Parálisis cerebral y patología neurológica:</strong> el soporte del agua facilita patrones de movimiento que serían inaccesibles en seco.</li>
</ul>
<p>El aquafisio es conducido siempre por un fisioterapeuta dentro del agua, adaptando las técnicas de terapia manual y ejercicio al medio acuático. No debe confundirse con la natación terapéutica, que es una actividad más autónoma del paciente.</p>
<p>La temperatura del agua, típicamente entre 33 y 36°C en piscinas terapéuticas, contribuye adicionalmente a la relajación muscular, la vasodilatación periférica y la reducción del dolor.</p>`,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    id_image: 'unsplash_hydro_012',
    type_id: TYPES.rehabilitacion,
    createBy: PROFESSIONALS[1],
  },
];

async function seedBlogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB Atlas');

    const db = mongoose.connection.db;
    const collection = db.collection('blogs');

    // Verificar cuántos blogs existen
    const existingCount = await collection.countDocuments();
    console.log(`ℹ️  Blogs existentes: ${existingCount}`);

    // Preparar documentos con _id generados como strings (igual al modelo)
    const docs = BLOGS.map((blog) => ({
      _id: new ObjectId().toString(),
      ...blog,
      type_id: new ObjectId(blog.type_id),
      status: true,
      createdDate: new Date(),
      updatedDate: new Date(),
      __v: 0,
    }));

    const result = await collection.insertMany(docs);
    console.log(`✓ ${result.insertedCount} blogs de prueba insertados correctamente`);

    // Mostrar resumen
    docs.forEach((b) => console.log(`  - "${b.title}"`));

    await mongoose.disconnect();
    console.log('\n✓ Desconectado. ¡Seed completado!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

seedBlogs();
