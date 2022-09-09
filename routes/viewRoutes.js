const express = require('express')
const {
  getOverview,
  getTour,
  login,
  getAccount,
  getMyTours
} = require('../controllers/viewsController')
const { isLoggedIn, protect } = require('../controllers/authController')
const { createBookingCheckout } = require('../controllers/bookingController')

const router = express.Router()

router.get('/me', protect, getAccount)
router.get('/my-tours', protect, getMyTours)

router.use(isLoggedIn)

router.get('/', createBookingCheckout, getOverview)

router.get('/overview', getOverview)

router.get('/tour/:tourSlug', getTour)

router.get('/login', login)

module.exports = router
