const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Customize to your Application Needs
const Place = new Schema({
  placeID: String,
  people: Number,
});

module.exports = mongoose.model('Place', Place);
