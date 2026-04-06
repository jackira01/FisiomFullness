const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const AppointmentSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    _professional: {
      type: String,
      ref: 'User',
      required: true,
    },
    _patient: {
      type: String,
      ref: 'User',
      required: true,
    },
    _service: {
      type: String,
      ref: 'Service',
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    additionalDescription: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DEACTIVATE', 'PENDING', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = model('Appointment', AppointmentSchema);
