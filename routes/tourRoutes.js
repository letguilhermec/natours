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
  getMonthlyPlan,
} = require('../controllers/tourController')
const { protect, restrictTo } = require('../controllers/authController')
const reviewRouter = require('../routes/reviewRoutes')

//  ROUTER
const router = express.Router()

//  Mounting a router for nested route
router.use('/:tourId/reviews', reviewRouter)

//  ROUTES
router
  .route('/tour-stats')
  .get(getTourStats)

router
  .route('/monthly-plan/:year')
  .get(
    protect,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  )

router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours)

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour)

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    updateTour
  )
  .delete(
    protect,
    restrictTo('admin', 'lead-guide'),
    deleteTour
  )

module.exports = router
