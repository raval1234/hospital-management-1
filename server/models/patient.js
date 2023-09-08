const mongoose = require('mongoose');

const create_patient = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  diseases: [
    {
      type: String,
    },
  ],
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: 'doctor',
  },
});

module.exports = mongoose.model('patient', create_patient);
