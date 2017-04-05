const express = require('express');
const usersRouter = express.Router();
const Users = require('../models/users');

usersRouter.get('/current', function(req, res) {
  if (req.isAuthenticated()) {
    res.json({
      userLogged: true,
      userID: req.user._id,
    });
  } else {
    res.json({
      userLogged: false,
    });
  }
});

usersRouter.get('/data', function(req, res) {
  if (req.isAuthenticated()) {
    Users.findById(
      req.user._id,
      { _id: false, places: true, lastSearch: true },
      function(err, data) {
        res.json(data);
      }
    );
  } else {
    res.json({
      errorMessage: 'You are not authenticated',
    });
  }
});

usersRouter.put('/search', function(req, res) {
  if (req.isAuthenticated()) {
    Users.updateOne(
      { _id: req.user._id },
      { $set: { lastSearch: req.body.lastSearch } },
      function(err, data) {
        if (err) throw err;
        res.json(data);
      }
    );
  }
});

usersRouter.put('/add-place', function(req, res) {
  if (req.isAuthenticated()) {
    Users.updateOne(
      { _id: req.user._id },
      { $push: { places: req.body.placeID } },
      function(err, data) {
        if (err) throw err;
        res.json(data);
      }
    );
  }
});

usersRouter.put('/remove-place', function(req, res) {
  if (req.isAuthenticated()) {
    Users.updateOne(
      { _id: req.user._id },
      { $pull: { places: req.body.placeID } },
      function(err, data) {
        if (err) throw err;
        res.json(data);
      }
    );
  }
});

usersRouter.get('/logout', function(req, res) {
  if (req.isAuthenticated()) {
    req.logout();
    res.json({
      logoutMessage: 'Sorry to see you go!!!',
    });
  } else {
    res.json({
      errorMessage: 'You are not logged in!',
    });
  }
});

module.exports = usersRouter;
