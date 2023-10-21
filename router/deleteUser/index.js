const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.get('/', (req, res) => {
    User.deleteMany({})
    .then(() => {
        return res.send('User delete successfully');
    })
});

module.exports = router;