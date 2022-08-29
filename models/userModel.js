const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
      /*minlength: [5, "User name must have at least 5 characters"],
      maxlength: [50, "User name must have at most 50 characters"]*/
    },
    email: {
      type: String,
      required: [true, "Please tell us your email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: 
      },
      /*minlength: [],
      maxlength: [],*/
    },
    photo: {
      type: '??',
    },
    password: {
      type: String,
      required: true,
    },
    passwordConfirm: {
      type: String,
      required: true,
    }
  }
)
