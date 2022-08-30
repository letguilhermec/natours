const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm the password.'],
      validate: {
        validator: function(val) {
          // Only works when creating NEW documents
          return val === this.password
        },
        message: 'Passwords must match.',
      },
    },
    passwordChangedAt: Date,
  }
)

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.pre('updateOne', function() {
  this.passwordChangedAt = Date.now()
})

userSchema.methods.correctPass = async function(candidate, correct) {
  return await bcrypt.compare(candidate, correct)
}

userSchema.methods.changedPass = async function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }

  return false
}

const User = mongoose.model('User', userSchema)

module.exports = User
