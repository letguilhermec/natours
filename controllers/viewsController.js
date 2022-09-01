const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res) => {
  //  Get All Tours from API
  const tours = await Tour.find()

  //  Render template using data from API
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  })
})

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    tour,
    title: `${tour.name} Tour`
  })
}
