const express = require('express')
const { getOverview, getTour, login, getAccount } = require('../controllers/viewsController')
const { isLoggedIn, protect } = require('../controllers/authController')

const router = express.Router()

router.get('/me', protect, getAccount)

router.use(isLoggedIn)

router.get('/', getOverview)

router.get('/overview', getOverview)

router.get('/tour/:tourSlug', getTour)

router.get('/login', login)


module.exports = router
