const express = require('express')

const { protect, restrictTo } = require('../controllers/authController')
const { getCheckoutSession } = require('../controllers/bookingController')

const router = express.Router()

router.route('/checkout-session/:tourId').get(protect, getCheckoutSession)

module.exports = router
