const mongoose = require('mongoose');

const create_patient = new mongoose.Schema({
  first_name: {
    type: String,
    require:true
  },
  last_name: {
    type: String,
    require:true
  },
  email: {
    type: String,
    require:true
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    require:true
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
      require:true
    },
  ],
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: 'doctor',
  },
});

module.exports = mongoose.model('patient', create_patient);
