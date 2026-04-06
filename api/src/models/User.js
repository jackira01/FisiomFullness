const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;
const dotenv = require('dotenv');
dotenv.config();

const { URL_PROFILE_DEFAULT } = process.env;

const User = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },

    firstname: {
      type: String,
      default: ' ',
    },
    lastname: {
      type: String,
      default: ' ',
    },
    status: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: false,
      default: '',
    },
    providers: {
      type: [String],
      default: ['local'],
    },
    hasPassword: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },

    role: {
      type: String,
      default: 'user',
    },
    token: {
      type: String,
      default: '',
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude] — orden estándar GeoJSON
        default: [0, 0],
      },
    },
    address: {
      streetName: {
        type: String,
        default: '',
      },
      streetNumber: {
        type: String,
        default: '',
      },
      floorAppartment: {
        type: String,
        default: '',
      },
      additionalInfo: {
        type: String,
        default: '', // Información descriptiva (ej: Centro comercial, local 51) - no se usa en geocodificación
      },
      city: {
        type: String,
        default: '',
      },
      state: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
    },
    image: {
      type: String,
      default: URL_PROFILE_DEFAULT,
    },
    // Campos específicos para profesionales
    specialty: {
      type: String,
      default: '',
    },
    consultationPrice: {
      type: Number,
      default: 0,
    },
    license: {
      type: String,
      default: '',
    },
    // Especialidades del profesional (array de objetos con _id y name)
    specialties: {
      type: [
        {
          _id: { type: String },
          name: { type: String },
        },
      ],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    // Disponibilidad horaria del profesional
    availability: {
      type: [
        {
          day: { type: String },
          timeSlots: [
            {
              _id: { type: String },
              start: { type: String },
              end: { type: String },
            },
          ],
        },
      ],
      default: [],
    },
    // Experiencia laboral del profesional
    experience: {
      type: [
        {
          _id: { type: String },
          title: { type: String, default: '' },
          company: { type: String, default: '' },
          startDateMonth: { type: Number, default: 1 },
          startDateYear: { type: Number, default: 2020 },
          endDateMonth: { type: Number, default: null },
          endDateYear: { type: Number, default: null },
          current: { type: Boolean, default: false },
          description: { type: String, default: '' },
        },
      ],
      default: [],
    },
    // Rating promedio calculado a partir de las valoraciones
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    // Aprobación por el administrador
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: [lat, lng] para retrocompatibilidad con CustomMap (que espera coordinates[0]=lat)
User.virtual('coordinates').get(function () {
  if (this.location && Array.isArray(this.location.coordinates)) {
    return [this.location.coordinates[1], this.location.coordinates[0]];
  }
  return [0, 0];
});

// Índice geoespacial para consultas de proximidad ($near, $geoWithin, etc.)
User.index({ location: '2dsphere' });

// Índices para los campos más consultados en filtros de profesionales
User.index({ role: 1 });
User.index({ role: 1, isApproved: 1 });
User.index({ 'address.state': 1 });
User.index({ 'address.city': 1 });
User.index({ specialty: 1 });
User.index({ 'specialties.name': 1 });

module.exports = model('User', User);
