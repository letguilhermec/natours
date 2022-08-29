const express = require('express')

//  FUNCTIONS
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/userController')
const { signup } = require('../controllers/authController')

//  ROUTER
const router = express.Router()

router
  .post('/signup', signup)

router
  .route('/')
  .get(getAllUsers)
  .post(createUser)

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

module.exports = router
