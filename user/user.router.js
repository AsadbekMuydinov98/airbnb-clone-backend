const express = require('express')
const router = express.Router()
const userController = require('./user.controller')

router.route('/register').post(userController.userRegister)
router.route('/login').post(userController.userLogin)
router.route('/logout').post(userController.logout)
router.route('/profile').get(userController.userProfile)

module.exports = router