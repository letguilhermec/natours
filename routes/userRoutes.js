const express = require('express')

//  FUNCTIONS
const { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe, getMe } = require('../controllers/userController')
const { signup, login, protect, forgotPass, resetPass, updatePass, restrictTo } = require('../controllers/authController')

//  ROUTER
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPass)
router.patch('/resetPassword/:token', resetPass)

router.use(protect)
router.get('/me', getMe, getUser)
router.patch('/updateMyPassword', updatePass)
router.patch('/updateMe', updateMe)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin'))
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
