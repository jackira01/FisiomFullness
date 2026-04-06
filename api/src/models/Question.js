const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const answerSchema = new Schema(
  {
    text: { type: String, required: true },
    professionalId: { type: String, ref: 'User', required: true },
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    text: { type: String, required: true, maxlength: 500 },
    specialtyId: { type: String, default: null },
    userId: { type: String, ref: 'User', default: null },
    isAnswered: { type: Boolean, default: false },
    answer: { type: answerSchema, default: null },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

module.exports = model('Question', questionSchema);
