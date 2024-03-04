
const Place = require('./place.model');
const express = require('express')
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
const app = express()
app.use('/uploads', express.static(__dirname+'/uploads'));



async function addPlaces(req, res) {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
}


async function userPlaces(req, res) {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
}

async function getOnePlace(req, res) {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Place.findById(id));
}


async function updatePlace(req, res) {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
}


async function getAllPlaces(req, res) {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await Place.find() );
}

async function deletePlace(req, res) {
  try {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;
    const { id } = req.params;
    
    // Verifying user token
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;

      // Finding the place to delete
      const placeDoc = await Place.findById(id);

      // Checking if the authenticated user is the owner of the place
      if (userData.id === placeDoc.owner.toString()) {
        // Deleting the place
        await placeDoc.deleteOne();
        res.json({ message: "Place deleted successfully." });
      } else {
        res.status(403).json({ message: "You are not authorized to delete this place." });
      }
    });
  } catch (error) {
    // Handling any errors
    console.error("Error deleting place:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}


module.exports = {
  addPlaces,
  userPlaces,
  getOnePlace,
  updatePlace,
  getAllPlaces,
  deletePlace,
}