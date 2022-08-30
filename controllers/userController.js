const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

//  FUNCTIONS
const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

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

exports.updateMe = catchAsync(async (req, res, next) => {
  //  Throw error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400))
  }

  //  Filter out fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email')

  //  Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})
