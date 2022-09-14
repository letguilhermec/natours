const express = require('express')
const {
  getOverview,
  getTour,
  login,
  getAccount,
  getMyTours,
  alert,
  signup
} = require('../controllers/viewsController')
const { isLoggedIn, protect } = require('../controllers/authController')

const router = express.Router()

router.use(alert)

router.get('/me', protect, getAccount)
router.get('/my-tours', protect, getMyTours)

router.use(isLoggedIn)

router.get('/', getOverview)
router.get('/overview', getOverview)
router.get('/tour/:tourSlug', getTour)
router.get('/login', login)
router.get('/signup', signup)

module.exports = router
