/**
 * Seed script para crear productos de prueba en la BD.
 * Uso: node seed-products.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

// IDs de Categories existentes en la DB
const CATEGORIES = {
  perifericos: '69b4aa54cb2e79d3f740d5ae',
  suplementos: '69b4aa67cb2e79d3f740d5b0',
  mobiliario: '69b4aa73cb2e79d3f740d5b2',
  electronica: '69b4aa7ccb2e79d3f740d5b4',
  domotica: '69b4aa84cb2e79d3f740d5b6',
  fitness: '69b4aa86cb2e79d3f740d5b8',
};

const PRODUCTS = [
  // ── Equipamiento para Fitness y Recuperación ──────────────────────────────
  {
    name: 'Rodillo de espuma - Foam Roller 90 cm',
    description:
      'Rodillo de espuma de alta densidad para liberación miofascial, masaje de tejidos profundos y recuperación muscular post-entrenamiento. Superficie texturizada con puntos de presión para maximizar el drenaje linfático. Soporta hasta 150 kg. Incluye guía de ejercicios en PDF.',
    price: 89000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&q=80',
    id_image: 'unsplash_foam_roller_001',
    category: CATEGORIES.fitness,
  },
  {
    name: 'Bandas elásticas de resistencia progresiva (set x5)',
    description:
      'Juego de 5 bandas elásticas con niveles de resistencia desde muy suave hasta extra fuerte (color coded). Fabricadas en látex natural de alta elasticidad. Ideal para fisioterapia, rehabilitación muscular, activación pre-entreno y entrenamiento de fuerza en casa. Incluye bolsa de transporte y guía de ejercicios.',
    price: 65000,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=600&q=80',
    id_image: 'unsplash_resistance_bands_002',
    category: CATEGORIES.fitness,
  },
  {
    name: 'Pelota de masaje con pinchos - Lacrosse Ball Set',
    description:
      'Set de 3 pelotas de masaje: lisa, con pinchos suaves y de doble nódulo. Perfectas para el masaje de puntos gatillo en pies, espalda, glúteos y cuello. Material TPR hipoalergénico, resistente y fácil de limpiar. Diámetro 6,5 cm. El complemento ideal después de la sesión de fisioterapia.',
    price: 42000,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    id_image: 'unsplash_massage_ball_003',
    category: CATEGORIES.fitness,
  },
  {
    name: 'Colchoneta de yoga y ejercicio 10mm - antideslizante',
    description:
      'Mat de ejercicios de PVC ecológico de 10 mm de grosor con superficie antideslizante doble cara. Dimensiones 183 x 61 cm. Ideal para sesiones de fisioterapia domiciliaria, pilates, yoga y ejercicio en el suelo. Incluye correa de transporte. Disponible en verde, azul y morado.',
    price: 75000,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80',
    id_image: 'unsplash_yoga_mat_004',
    category: CATEGORIES.fitness,
  },
  {
    name: 'Rodillo de masaje eléctrico recargable',
    description:
      'Rodillo de masaje de calor con vibración en 6 intensidades y cabezal intercambiable (plano, bola, horquilla). Batería de 2400 mAh con hasta 3 horas de autonomía. Temperatura de calor regulable entre 40-50°C para relajación muscular profunda. Ideal para contracturas cervicales, lumbares y extremidades.',
    price: 185000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    id_image: 'unsplash_electric_roller_005',
    category: CATEGORIES.fitness,
  },
  {
    name: 'Balón suizo medicinal 65 cm',
    description:
      'Balón de ejercicio de PVC anti-estallido de 65 cm de diámetro. Soporta hasta 300 kg de carga estática. Ideal para ejercicios de core, trabajo postural, rehabilitación lumbar y estiramiento. Textura antideslizante en toda la superficie. Incluye bomba de inflado manual. Apto para uso profesional en consultas de fisioterapia.',
    price: 98000,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    id_image: 'unsplash_swiss_ball_006',
    category: CATEGORIES.fitness,
  },
  {
    name: 'Plataforma de equilibrio - Balance Board de madera',
    description:
      'Tabla de equilibrio de madera de abedul con base semiesférica de goma. Ideal para rehabilitación de tobillo y rodilla, trabajo propioceptivo y mejora del equilibrio. Diámetro 40 cm, soporta hasta 120 kg. Superficie antideslizante con acabado en laca mate. Perfecta para uso en consulta de fisioterapia y en casa.',
    price: 120000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&q=80',
    id_image: 'unsplash_balance_board_007',
    category: CATEGORIES.fitness,
  },
  {
    name: 'Mancuernas ajustables de neopreno 1-5 kg (par)',
    description:
      'Par de mancuernas ajustables revestidas en neopreno con agarre ergonómico antideslizante. Rango de peso de 1 a 5 kg por mancuerna. Ideales para ejercicios de fortalecimiento en rehabilitación de hombro, codo y muñeca. Diseño compacto para uso en casa o consulta. Core de hierro fundido con recubrimiento de neopreno de primera calidad.',
    price: 145000,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    id_image: 'unsplash_dumbbells_008',
    category: CATEGORIES.fitness,
  },

  // ── Suplementos ───────────────────────────────────────────────────────────
  {
    name: 'Colágeno hidrolizado + Vitamina C - 300g',
    description:
      'Colágeno hidrolizado tipo I y III con vitamina C para máxima absorción. 10.000 mg de colágeno por porción. Apoya la recuperación de tendones, ligamentos, cartílagos y piel. Sin sabor para mezclar fácilmente en cualquier bebida. Libre de gluten, sin colorantes ni conservantes artificiales. 30 porciones por envase.',
    price: 82000,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=80',
    id_image: 'unsplash_collagen_009',
    category: CATEGORIES.suplementos,
  },
  {
    name: 'Magnesio quelado 400mg - 60 cápsulas',
    description:
      'Magnesio quelado (bisglicinato) de alta biodisponibilidad para la salud muscular y nerviosa. Contribuye a reducir calambres, espasmos musculares y fatiga. Ideal como complemento durante la rehabilitación y el entrenamiento. 400 mg de magnesio elemental por cápsula. Sin estearato de magnesio. Envase para 2 meses de tratamiento.',
    price: 58000,
    stock: 70,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    id_image: 'unsplash_magnesium_010',
    category: CATEGORIES.suplementos,
  },
  {
    name: 'Omega-3 Ultra Puro 1000mg EPA/DHA - 90 cápsulas',
    description:
      'Aceite de pescado de aguas profundas con concentración de 1000 mg de EPA y DHA por cápsula. Potente anti-inflamatorio natural, apoya la recuperación muscular, la salud articular y cardiovascular. Forma triglicérido reresterificado para máxima absorción. Sin sabor a pescado gracias al recubrimiento entérico.',
    price: 95000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80',
    id_image: 'unsplash_omega3_011',
    category: CATEGORIES.suplementos,
  },
  {
    name: 'Proteína de suero aislada Vainilla - 1kg',
    description:
      'Proteína de suero de leche aislada (WPI) con 27g de proteína por porción y menos de 1g de carbohidratos. Perfil completo de aminoácidos esenciales y BCAAs. Procesada por ultrafiltración en frío para preservar las fracciones bioactivas. Ideal para la recuperación muscular post-rehabilitación y mantenimiento de masa magra en adultos mayores.',
    price: 168000,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80',
    id_image: 'unsplash_whey_012',
    category: CATEGORIES.suplementos,
  },

  // ── Mobiliario de Oficina (ergonomía) ─────────────────────────────────────
  {
    name: 'Cojín lumbar ergonómico para silla de oficina',
    description:
      'Soporte lumbar de espuma viscoelástica con memoria de forma y malla transpirable. Curvatura anatómica diseñada para mantener la lordosis natural de la columna lumbar. Tiras de sujeción universales compatibles con cualquier silla. Reduce la carga en discos intervertebrales hasta un 30%. Recomendado por fisioterapeutas para trabajadores sedentarios.',
    price: 55000,
    stock: 90,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
    id_image: 'unsplash_lumbar_cushion_013',
    category: CATEGORIES.mobiliario,
  },
  {
    name: 'Reposapiés ajustable para escritorio',
    description:
      'Reposapiés ergonómico de altura e inclinación ajustable (0-30°). Superficie masajeadora con relieve de acupresión. Mejora la circulación en las piernas, reduce la tensión lumbar y facilita una postura neutra de pelvis. Marco de acero inoxidable con plataforma antideslizante. Soporta hasta 80 kg.',
    price: 78000,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
    id_image: 'unsplash_footrest_014',
    category: CATEGORIES.mobiliario,
  },

  // ── Periféricos y Hardware (electromedicina) ──────────────────────────────
  {
    name: 'TENS/EMS portátil de 4 canales con pantalla',
    description:
      'Electroestimulador portátil TENS (alivio del dolor) y EMS (estimulación muscular) de 4 canales independientes. 20 programas preconfigurados y modo manual. Pantalla LCD, batería recargable USB-C con 8 horas de autonomía. Incluye 8 electrodos autoadhesivos, cables y funda de transporte. Certificado CE para uso doméstico.',
    price: 210000,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80',
    id_image: 'unsplash_tens_015',
    category: CATEGORIES.perifericos,
  },
  {
    name: 'Pistola de masaje percusivo - 6 cabezales',
    description:
      'Pistola de masaje percusivo profesional con motor brushless sin escobillas de bajo ruido (<45 dB). 5 velocidades de percusión (1200-3200 RPM), 12 mm de amplitud. 6 cabezales intercambiables para diferentes grupos musculares. Batería 2500 mAh con 5 horas de uso. Pantalla LED con indicador de batería. Incluye maletín de transporte.',
    price: 320000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=600&q=80',
    id_image: 'unsplash_massage_gun_016',
    category: CATEGORIES.perifericos,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB Atlas');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    const existingCount = await collection.countDocuments();
    console.log(`ℹ️  Productos existentes: ${existingCount}`);

    const docs = PRODUCTS.map((product) => ({
      _id: new ObjectId().toString(),
      ...product,
      category: new ObjectId(product.category),
      status: true,
      amount: 1,
      createdDate: new Date(),
      updatedDate: new Date(),
      __v: 0,
    }));

    const result = await collection.insertMany(docs);
    console.log(`✓ ${result.insertedCount} productos de prueba insertados correctamente\n`);

    const byCategory = {};
    docs.forEach((p) => {
      const catName = Object.entries(CATEGORIES).find(([, v]) => v === p.category.toString())?.[0] || 'otro';
      if (!byCategory[catName]) byCategory[catName] = [];
      byCategory[catName].push(p.name);
    });

    for (const [cat, names] of Object.entries(byCategory)) {
      console.log(`  [${cat}]`);
      names.forEach((n) => console.log(`    - ${n}`));
    }

    await mongoose.disconnect();
    console.log('\n✓ Desconectado. ¡Seed completado!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

seedProducts();
