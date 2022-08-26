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

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    devError(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let newErr = { ...err }
    if (err.name === 'CastError') newErr = handleCastErrorDB(newErr)
    if (err.code === 11000) newErr = handleDuplicateFieldsDB(newErr)
    prodError(newErr, res)
  }

}
