const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const RatingSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    professionalId: {
      type: String,
      ref: 'User',
      required: true,
      index: true,
    },
    // _user y _professional son los nombres que usa el frontend
    _professional: {
      type: String,
      ref: 'User',
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    _user: {
      type: String,
      ref: 'User',
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    description: {
      type: String,
      default: '',
      maxlength: 300,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índice compuesto para verificar si un usuario ya comentó a un profesional
RatingSchema.index({ professionalId: 1, userId: 1 });

module.exports = model('Rating', RatingSchema);
