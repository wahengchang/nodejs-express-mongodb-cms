const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const User = require('../../models/User');

// GET request for signup page
router.get('/', (req, res) => {
    res.render('signup', { error: null });
});

// POST request for signup action
router.post('/', (req, res) => {
    
  const { username, password } = req.body;

  // Check if the username is already taken
  User.findOne({ username })
    .then(existingUser => {
      if (existingUser) {
        return res.render('signup', { error: 'Username already exists' });
      }

      // Hash the password
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          return res.render('signup', { error: 'Error hashing password' });
        }

        // Create a new user
        const newUser = new User({
          username,
          password: hash
        });

        // Save the user to the database
        newUser.save()
          .then(() => {
            res.redirect('/login');
          })
          .catch(() => {
            res.render('signup', { error: 'Error creating user' });
          });
      });
    })
    .catch(() => {
      res.render('signup', { error: 'Error checking existing user' });
    });
});

module.exports = router;