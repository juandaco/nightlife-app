require('dotenv').config();
const express = require('express');
const rp = require('request-promise-native');
const placesRouter = express.Router();

placesRouter.get('/data', function(req, res, next) {
  const reqOptions = {
    uri: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    qs: {
      key: process.env.GOOGLE_PLACES_API_KEY,
      location: req.query.location,
      radius: 3000,
      opennow: true,
      type: 'restaurant'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true 
  };
  rp(reqOptions)
    .then(places => {
      res.json(places);
    })
    .catch(err => {
      throw err;
    });
});

module.exports = placesRouter;
