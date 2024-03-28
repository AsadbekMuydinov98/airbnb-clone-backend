const express = require('express');
const router = express.Router();
const  multer  = require('multer')
const photosMiddleware = multer({dest: 'uploads/'});

const placeController = require('./place.controller');

router.route('/').get(placeController.getAllPlaces);
router.route('/upload-by-link').post(placeController.uploadByLink);
router.route('/upload').post(photosMiddleware.array('photos', 100), placeController.Upload);
router.route('/add').post(placeController.addPlaces);
router.route('/user-places').get(placeController.userPlaces);
router.route('/:id').get(placeController.getOnePlace);
router.route('/:id').put(placeController.updatePlace);
router.route('/:id').delete(placeController.deletePlace);

module.exports = router;
