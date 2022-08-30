const AppError = require('../utils/appError')

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const prodError = (err, res) => {
  //  Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
    //  Programming or other unknown error: avoid leaking details
  } else {
    //  1) Log error
    console.error('ERROR ☢️', err)
    //  2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  const field = Object.keys(err.keyPattern)
  const message = `Duplicate field: '${field}' -> Content: '${err.keyValue[field]}'`
  return new AppError(message, 400)
}

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(error => error.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please login again.', 401)

const handleJWTExpired = () => new AppError('Your token has expired. Please login again', 401)

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    devError(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let newErr = { ...err }
    if (err.name === 'CastError') newErr = handleCastErrorDB(newErr)
    if (err.code === 11000) newErr = handleDuplicateFieldsDB(newErr)
    if (err.name === 'ValidationError') newErr = handleValidationError(newErr)
    if (err.name === 'JsonWebTokenError') newErr = handleJWTError(newErr)
    if (err.name === 'TokenExpiredError') newErr = handleJWTExpired(newErr)
    prodError(newErr, res)
  }

}
