const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is a required field'],
  },

  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Email is a required field'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 6,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Entered passwords do not match',
    },
  },

  photo: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
