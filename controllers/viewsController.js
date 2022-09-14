const Tour = require('../models/tourModel')
const Booking = require('../models/bookingModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res, next) => {
  //  Get All Tours from collection
  const tours = await Tour.find()

  //  Render template using data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  //  Get the data for requested tour
  const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  })

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404))
  }

  // Render the template using data
  res.status(200).render('tour', {
    tour,
    title: `${tour.name} Tour`
  })
})

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  })
}

exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up'
  })
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
  //  Find all Bookings
  const bookings = await Booking.find({ user: req.user.id })

  //  Find tours w/ the returned IDs
  const tourIDs = bookings.map(booking => booking.tour)
  const tours = await Tour.find({ _id: { $in: tourIDs } })

  res.status(200).render('overview', {
    title: 'My Bookings',
    tours
  })
})

exports.alert = (req, res, next) => {
  const { alert } = req.query
  if (alert === 'booking') {
    res.locals.alert =
      'Your booking was successful! Please check your e-mail for a confirmation. If your booking does not show up here immediately, please come back later.'
  }
  next()
}
