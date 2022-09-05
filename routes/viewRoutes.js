const express = require('express')
const { getOverview, getTour, login } = require('../controllers/viewsController')
const { isLoggedIn } = require('../controllers/authController')

const router = express.Router()

router.use(isLoggedIn)

router.get('/', getOverview)

router.get('/overview', getOverview)

router.get('/tour/:tourSlug', getTour)

router.get('/login', login)

module.exports = router
