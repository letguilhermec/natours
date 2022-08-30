const express = require('express')

//  FUNCTIONS
const { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe } = require('../controllers/userController')
const { signup, login, protect, forgotPass, resetPass, updatePass } = require('../controllers/authController')

//  ROUTER
const router = express.Router()

router
  .post('/signup', signup)

router
  .post('/login', login)

router
  .post('/forgotPassword', forgotPass)

router
  .patch('/resetPassword/:token', resetPass)

router
  .patch('/updateMyPassword', protect, updatePass)

router
  .patch('/updateMe', protect, updateMe)

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
