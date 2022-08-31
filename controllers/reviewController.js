const Review = require('../models/reviewModel')
const { deleteOne, updateOne, createOne, getOne, getAll } = require('../controllers/handlerFactory')

exports.setTourIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  req.body.user = req.user.id

  next()
}

exports.getAllReviews = getAll(Review)

exports.getReview = getOne(Review)

exports.createReview = createOne(Review)

exports.updateReview = updateOne(Review)

exports.deleteReview = deleteOne(Review)
