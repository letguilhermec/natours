const Tour = require('../models/tourModel')
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
  const tour = await Tour
    .findOne({ slug: req.params.tourSlug })
    .populate({
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
    title: 'Log into your accont'
  })
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  })
}
