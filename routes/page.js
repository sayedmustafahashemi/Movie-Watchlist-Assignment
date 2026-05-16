const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Home page - redirect to movies if logged in
router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/movies');
});

// Login page
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/movies');
  }
  res.render('login', { 
    success_msg: req.flash('success_msg'), 
    error_msg: req.flash('error_msg'),
    error: req.flash('error')
  });
});

// Register page
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/movies');
  }
  res.render('register', { errors: null, success_msg: null });
});

module.exports = router;