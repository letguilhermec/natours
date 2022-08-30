const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const morgan = require('morgan')
const hpp = require('hpp')
const AppError = require('./utils/appError')
const errorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

//  MIDDLEWARE
//  Set secure HTTP headers
app.use(helmet())

//  Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//  Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour!'
})
app.use('/api', limiter)

//  Body parser -> reads data from req.body
app.use(express.json({ limit: '10kb' }))

//  Data sanitization against noSQL query injection
app.use(mongoSanitize())
//  Data sanitization against XSS injection
app.use(xss())

//  Prevent parameter polution
app.use(hpp())

//  Serve static files
app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on the server!`, 404))
})

app.use(errorHandler)

module.exports = app
