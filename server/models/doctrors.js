const mongoose = require('mongoose');

const create_doctors = new mongoose.Schema({
  name: {
    type: String,
  },
  call_num: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  hospitalId: {
    type: mongoose.Types.ObjectId,
    ref: 'hospital',
  },
});

module.exports = mongoose.model('doctor', create_doctors);
