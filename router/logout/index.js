const express = require('express');
const router = express.Router();

// GET request for logout
router.get('/', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
  });

module.exports = router;