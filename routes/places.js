require('dotenv').config();
const express = require('express');
const yelp = require('yelp-fusion');
const placesRouter = express.Router();

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
