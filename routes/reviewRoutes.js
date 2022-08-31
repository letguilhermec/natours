const express = require('express')

const { protect, restrictTo } = require('../controllers/authController')
const { getAllReviews, getReview, createReview, deleteReview, updateReview, setTourIds } = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

router.use(protect)

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourIds, createReview)

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview)

module.exports = router
