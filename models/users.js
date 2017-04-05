const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Customize to your Application Needs
const User = new Schema(
  {
    username: String,
    twitterID: Number,
    name: String,
    lastSearch: {
      type: String,
      default: '',
    },
    places: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', User);
