const mongoose = require('mongoose');
import bcrypt from 'bcrypt';

const create_user = new mongoose.Schema(
  {
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
    password: {
      type: String,
    },
    tokens: [
      {
        type: String,
      },
    ],
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: 'doctor',
    },
  },
  { collection: 'user', timestamps: true }
);

create_user.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

create_user.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', create_user);
