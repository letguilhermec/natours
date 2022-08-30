const express = require('express')

//  FUNCTIONS
const {
  aliasTopTours,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPan,
} = require('../controllers/tourController')

const { protect } = require('../controllers/authController')

//  ROUTER
const router = express.Router()

//  ROUTES
router
  .route('/tour-stats')
  .get(getTourStats)

router
  .route('/monthly-plan/:year')
  .get(getMonthlyPan)

router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours)

router
  .route('/')
  .get(protect, getAllTours)
  .post(createTour)

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

module.exports = router
