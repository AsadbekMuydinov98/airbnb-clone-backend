const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlaceSchema = new Schema(
  {
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
    files: [Object],
    photos: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Place", PlaceSchema);
