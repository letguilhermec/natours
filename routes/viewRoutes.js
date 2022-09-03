const express = require('express')
const { getOverview, getTour, login } = require('../controllers/viewsController')

const router = express.Router()

router.get('/', getOverview)

router.get('/overview', getOverview)

router.get('/tour/:tourSlug', getTour)

router.get('/login', login)

module.exports = router
