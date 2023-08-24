import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { salt } from '../../bin/www';
import { roles } from '../helpers/roles';

const userSchema = new Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
    },

    role: {
      type: String,
      enum: roles,
    },

    activeSessions: [
      {
        type: String,
        default: [],
      },
    ],

    profilePicture: {
      type: String,
      default: '',
    },
  },
  { collection: 'user', timestamps: true }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const user = mongoose.model('user', userSchema);
module.exports = user;
