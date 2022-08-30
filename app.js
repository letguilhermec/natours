const express = require('express')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const errorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

//  MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//  RATE-LIMITING 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour!'
})
app.use('/api', limiter)

app.use(express.json())

//  SERVE STATIC FILES
app.use(express.static(`${__dirname}/public`))


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on the server!`, 404))
})

app.use(errorHandler)

module.exports = app
