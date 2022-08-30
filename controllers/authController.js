const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = id => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_CONFIG }
  )

}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  const token = signToken(newUser._id)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  //  Check if email and password are in req.body
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400))
  }

  //  Check if user exists && if password is correct
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPass(password, user.password))) {
    return next(new AppError('Invalid email or password.', 401))
  }

  //  If everything is OK, send JWT back to client
  const token = signToken(user._id)

  res.status(200).json({
    status: 'success',
    token
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  //  Get token and check if exists
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401))
  }

  //  Validate token
  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  //  Check if user still exists
  const user = await User.findById(payload.id)
  if (!user) {
    return next(new AppError('The user no longer exists.', 401))
  }

  //  Check if user changed password after the token was issued
  if (user.changedPass(payload.iat)) {
    //  --- Change message / Too revealing
    return next(new AppError('User recently changed password! Please log in again.', 401))
  }

  //  Grant access to protected route
  req.user = user
  next()
})
