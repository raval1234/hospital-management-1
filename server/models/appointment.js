const mongoose = require('mongoose');

const appointment = new mongoose.Schema({
  reason: {
    type: String,
  },
  time: {
    type: Date,
  },
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: 'doctor',
  },
  patient: {
    type: mongoose.Types.ObjectId,
    ref: 'patient',
  },
  roomId: {
    type: mongoose.Types.ObjectId,
    ref: 'room',
  },
});

module.exports = mongoose.model('appointment', appointment);
