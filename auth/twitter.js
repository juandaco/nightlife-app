require('dotenv').config();
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const Users = require('../models/users');
const passportUserSetup = require('./passportUserSetup');

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL
    },
    function(token, tokenSecret, profile, done) {
      const searchQuery = {
        twitterID: profile.id
      };

      // Customize your User
      const updates = {
        username: profile.username,
        name: profile.displayName,
        id: profile.id
      };

      const options = {
        upsert: true,
        setDefaultsOnInsert: true
      };

      // update the user if s/he exists or add a new user
      Users.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
        if (err) {
          return done(err);
        } else {
          return done(null, user);
        }
      });
    }
  )
);

// serialize user into the session
passportUserSetup();

module.exports = passport;
