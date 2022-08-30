const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

//  FUNCTIONS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Endpoint not yet implemented'
  })
}

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Endpoint not yet implemented'
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Endpoint not yet implemented'
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Endpoint not yet implemented'
  })
}

exports.updateMe = (req, res, next) => {
  //  Throw error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new A)
  }

  //  Update user document
}
