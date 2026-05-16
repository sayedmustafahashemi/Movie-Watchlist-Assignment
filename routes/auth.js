const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Register page
router.get('/register', (req, res) => {
  res.render('register', { errors: null, success_msg: null });
});

// Register handle
router.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  
  let errors = [];
  
  // Validation
  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }
  
  if (errors.length > 0) {
    res.render('register', { errors, success_msg: null });
  } else {
    try {
      // Check if user exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      
      if (existingUser) {
        if (existingUser.username === username) {
          errors.push({ msg: 'Username already exists' });
        }
        if (existingUser.email === email) {
          errors.push({ msg: 'Email already exists' });
        }
        res.render('register', { errors, success_msg: null });
      } else {
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          email,
          password: hashedPassword
        });
        
        await newUser.save();
        
        // Redirect to login with success message
        req.flash('success_msg', 'Registration successful! Please login.');
        res.redirect('/login');
      }
    } catch (err) {
      console.log(err);
      errors.push({ msg: 'Server error. Please try again.' });
      res.render('register', { errors, success_msg: null });
    }
  }
});

// Login page
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/movies');
  }
  res.render('login', { error_msg: req.flash('error_msg'), error: req.flash('error') });
});

// Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/movies',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

module.exports = router;