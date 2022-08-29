const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name.'],
      /*minlength: [5, "User name must have at least 5 characters"],
      maxlength: [50, "User name must have at most 50 characters"]*/
    },
    email: {
      type: String,
      required: [true, 'Please tell us your email.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.'],
      /*minlength: [],
      maxlength: [],*/
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minlength: [8, 'Password must have at least 8 characters.'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm the password.'],
      validator: {
        validate: function(val) {
          return val = this.password
        },
        message: 'Passwords must match.',
      },
    },
  }
)

const User = mongoose.model(userSchema)

module.exports = User
