"use strict";
const Place = require("./place.model");
const express = require('express')
const jwt = require('jsonwebtoken');
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
const imageDownloader = require('image-downloader');
const fs = require('fs');



async function Upload(req, res){
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.slice(8));
  }
  res.json(uploadedFiles);
}

async function uploadByLink(req, res){
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname +'./../uploads/' +newName,
  });
  res.json(newName);
}

async function addPlaces(req, res){
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const {
      title, address, addedPhotos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner: userData.id, price,
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests,
      });
      res.json(placeDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create a new place' });
  }
}

async function updatePlace(req, res) {
  const token = await req.headers.authorization.replace("Bearer ", "")
  const placeId = req.params.id;
    let item = await Place.findOne({id:placeId})
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:filesArray,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
}


// Getting only user's place for owner
async function userPlaces(req, res) {
  const token = await req.headers.authorization.replace("Bearer ", "")
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
}


// Getting one place for viewing detailed
async function getOnePlace(req, res) {
  const {id} = req.params;
  res.json(await Place.findById(id));
}

// Getting all places for home page
async function getAllPlaces(req, res) {
  res.json( await Place.find() );
}

// Delete function
async function deletePlace(req, res) {
  try {
    const token = await req.headers.authorization.replace("Bearer ", "")
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
  Upload,
  uploadByLink,
  addPlaces,
  userPlaces,
  getOnePlace,
  updatePlace,
  getAllPlaces,
  deletePlace,
}

