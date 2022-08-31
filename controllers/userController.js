const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { deleteOne, updateOne, getOne, getAll } = require('../controllers/handlerFactory')

//  FUNCTIONS
const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please, use /signup instead.'
  })
}

exports.getAllUsers = getAll(User)

exports.getUser = getOne(User)

//  Not for password updates
exports.updateUser = updateOne(User)

exports.deleteUser = deleteOne(User)

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}
