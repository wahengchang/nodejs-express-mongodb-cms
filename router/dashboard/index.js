const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// GET request for signup page
router.get('/', (req, res) => {
    const user = req.user;
    res.render('dashboard', { user });
});


module.exports = router;