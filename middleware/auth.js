const { model } = require("mongoose");

const requireLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

const requireLogout = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/dashboard');
  }
};

module.exports = {
  requireLogin,
  requireLogout
};