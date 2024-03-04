const express = require('express')
const router = express.Router()
const placeController = require('./place.controller')


router.route('/user-places').get(placeController.userPlaces)
router.route('/:id').get(placeController.getOnePlace)
router.route('/:id').delete(placeController.deletePlace)
router.route('/').post(placeController.addPlaces)
router.route('/').put(placeController.updatePlace)
router.route('/').get(placeController.getAllPlaces)

module.exports = router



