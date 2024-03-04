const express = require('express')
const router = express.Router()
const path = require('path')

const userRouter = require('./user/user.router')
const placeRouter = require('./place/place.router')
const bookingRouter = require('./booking/booking.router')

router.use('/user', userRouter)
router.use('/places', placeRouter)
router.use('/bookings', bookingRouter)


module.exports = router