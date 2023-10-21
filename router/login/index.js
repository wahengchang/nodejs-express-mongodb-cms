const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure passport-local strategy
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        return done(null, user);
      });
    })
    .catch(err => done(err));
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => done(err));
});

// GET request for login page
router.get('/', (req, res) => {
  res.render('login', { error: null });
});

// POST request for login action
router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', { error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/dashboard');
    });
  })(req, res, next);
});

module.exports = router;