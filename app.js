const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const cors = require('cors')

const AppError = require('./utils/appError')
const errorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewsRouter = require('./routes/viewRoutes')

const app = express()

app.use(cors())

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//  MIDDLEWARE
//  Set secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

//  Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//  Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP address. Please try again in an hour!'
})
app.use('/api', limiter)

//  Body parser -> reads data from req.body
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

//  Data sanitization against noSQL query injection
app.use(mongoSanitize())
//  Data sanitization against XSS injection
app.use(xss())

//  Prevent parameter polution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsAverage',
    'ratingsQuantity',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}))

app.use((req, res, next) => {
  console.log(req.cookies)
  next()
})

//  Serve static files
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', viewsRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on the server!`, 404))
})

app.use(errorHandler)

module.exports = app
