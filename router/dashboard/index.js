const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const user = req.user;
    res.render('dashboard', { user });
});

module.exports = router;