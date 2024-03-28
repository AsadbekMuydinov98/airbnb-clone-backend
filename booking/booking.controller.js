const Booking = require('./booking.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

async function getUserDataFromReq(req) {
  const token = await req.headers.authorization.replace("Bearer ", "")
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

async function addBook(req, res) {
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
}



async function getBook(req, res) {
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
}


async function updateBook(req, res) {
  try {
    const userData = await getUserDataFromReq(req);
    const { id } = req.params;

    const {
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;

    const booking = await Booking.findOne({ _id: id, user: userData.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or you're not authorized to update it." });
    }

    booking.place = place;
    booking.checkIn = checkIn;
    booking.checkOut = checkOut;
    booking.numberOfGuests = numberOfGuests;
    booking.name = name;
    booking.phone = phone;
    booking.price = price;

    await booking.save();

    res.json({ message: "Booking updated successfully.", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}


async function deleteBook(req, res) {
  try {
    const userData = await getUserDataFromReq(req);
    
    const { id } = req.params;
    
    const booking = await Booking.findOne({ _id: id, user: userData.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or you're not authorized to delete it." });
    }

    await booking.deleteOne();

    res.json({ message: "Booking deleted successfully." });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  addBook,
  getBook,
  deleteBook,
  updateBook,
}
