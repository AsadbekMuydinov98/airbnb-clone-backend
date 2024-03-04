const express = require('express')
const router = express.Router()
const bookingController = require('./booking.controller')

router.route('/').get(bookingController.getBook)
router.route('/').post(bookingController.addBook)
router.route('/:id').put(bookingController.updateBook)
router.route('/:id').delete(bookingController.deleteBook)


module.exports = router