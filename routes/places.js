require('dotenv').config();
const express = require('express');
const placesRouter = express.Router();
const yelp = require('yelp-fusion');
const Places = require('../models/places');

/*
  Setup Yelp Acess Token
*/
let token;
let client;
yelp
  .accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET)
  .then(response => {
    token = response.jsonBody.access_token;
    client = yelp.client(token);
  })
  .catch(e => {
    console.log(e);
  });

// Routing
placesRouter.get('/data', function(req, res, next) {
  client
    .search({
      location: req.query.location,
      categories: 'bars',
    })
    .then(response => {
      res.json(response.jsonBody.businesses);
    })
    .catch(e => {
      console.log(e);
    });
});

placesRouter.get('/count', function(req, res) {
  Places.find({}, { _id: false, __v: false }).lean().exec(function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

placesRouter.put('/count/add', function(req, res) {
  if (req.isAuthenticated()) {
    Places.updateOne(
      { placeID: req.body.placeID },
      { $inc: { people: 1 } },
      { upsert: true },
      function(err, data) {
        if (err) throw err;
        res.json(data);
      }
    );
  }
});

placesRouter.put('/count/reduce', function(req, res) {
  if (req.isAuthenticated()) {
    Places.updateOne(
      { placeID: req.body.placeID },
      { $inc: { people: -1 } },
      function(err, data) {
        if (err) throw err;
        res.json(data);
      }
    );
  }
});

placesRouter.get('/:placeID', function(req, res, next) {
  client
    .reviews(req.params.placeID)
    .then(response => {
      res.json(response.jsonBody.reviews[0].text);
    })
    .catch(e => {
      console.log(e);
    });
});

module.exports = placesRouter;
