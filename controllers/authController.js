const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Email = require('../utils/email')

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id)

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  }

  res.cookie('jwt', token, cookieOptions)

  //  Remove password from response object
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })
  const url = `${req.protocol}://${req.get('host')}/me`

  await new Email(newUser, url).sendWelcome()

  createAndSendToken(newUser, 201, req, res)
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
  createAndSendToken(user, 200, req, res)
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    status: 'success'
  })
}

exports.protect = catchAsync(async (req, res, next) => {
  //  Get token and check if exists
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    )
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
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    )
  }

  //  Grant access to protected route
  req.user = user
  res.locals.user = user
  next()
})

//  Only for rendering pages w/ logged in user details / No errors
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //  Validate token
      const payload = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      )

      //  Check if user still exists
      const user = await User.findById(payload.id)
      if (!user) {
        return next()
      }

      //  Check if user changed password after the token was issued
      if (user.changedPass(payload.iat)) {
        //  --- Change message / Too revealing
        return next()
      }

      //  Make user accessible for template
      res.locals.user = user
    } catch (err) {
      return next()
    }
  }
  next()
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //  Roles -> Array []
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      )
    }
    next()
  }
}

exports.forgotPass = catchAsync(async (req, res, next) => {
  //  Get user based on email address
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new AppError('Email address not found.', 404))
  }

  //  Generate random reset token
  const resetToken = user.createPassResetToken()
  await user.save({ validateBeforeSave: false })

  try {
    //  Send token to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`

    await new Email(user, resetURL).sendReset()

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent via email.'
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new AppError(
        'There was an error sending the email. Please, try again later.',
        500
      )
    )
  }
})

exports.resetPass = catchAsync(async (req, res, next) => {
  //  Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  //  Set new password if token has not expired and there is a user
  if (!user) {
    return next(new AppError('Invalid or expired token.', 400))
  }

  //  Update changedPasswordAt for current user
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  //  Log the user in -> Send JWT to client
  createAndSendToken(user, 200, req, res)
})

exports.updatePass = catchAsync(async (req, res, next) => {
  //  Get user from collection
  const user = await User.findById(req.user.id).select('+password')

  //  Check if posted password is correct
  if (!(await user.correctPass(req.body.oldPassword, user.password))) {
    return next(new AppError('Invalid email or password', 401))
  }

  //  If so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  //  Log user in, send JWT back to client
  createAndSendToken(user, 200, req, res)
})
