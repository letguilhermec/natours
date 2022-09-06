const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { deleteOne, updateOne, getOne, getAll } = require('../controllers/handlerFactory')

//  For uploading and resizing photos
const sharp = require('sharp')
const multer = require('multer')

//  Saving on storage
/*const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users')
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${extension}`)
  }
})*/
const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('The file you tried to upload is not an image! Please try again.', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next()

  sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 })
}

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
  if (req.file) filteredBody.photo = req.file.filename

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
