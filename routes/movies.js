const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { ensureAuthenticated } = require('../middleware/auth');

// GET all movies (home page)
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.render('movies/index', { movies });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// GET create form
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('movies/new');
});

// POST create movie
router.post('/', ensureAuthenticated, async (req, res) => {
  const { title, genre, releaseYear, rating, watchStatus } = req.body;
  
  try {
    const newMovie = new Movie({
      title,
      genre,
      releaseYear,
      rating,
      watchStatus,
      user: req.user.id
    });
    await newMovie.save();
    req.flash('success_msg', 'Movie added successfully');
    res.redirect('/movies');
  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Error adding movie');
    res.redirect('/movies/new');
  }
});

// GET edit form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    // Check if movie belongs to user
    if (movie.user.toString() !== req.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/movies');
    }
    
    res.render('movies/edit', { movie });
  } catch (err) {
    console.log(err);
    res.redirect('/movies');
  }
});

// PUT update movie
router.put('/:id', ensureAuthenticated, async (req, res) => {
  const { title, genre, releaseYear, rating, watchStatus } = req.body;
  
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (movie.user.toString() !== req.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/movies');
    }
    
    movie.title = title;
    movie.genre = genre;
    movie.releaseYear = releaseYear;
    movie.rating = rating;
    movie.watchStatus = watchStatus;
    
    await movie.save();
    req.flash('success_msg', 'Movie updated successfully');
    res.redirect('/movies');
  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Error updating movie');
    res.redirect('/movies');
  }
});

// DELETE movie
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (movie.user.toString() !== req.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/movies');
    }
    
    await movie.deleteOne();
    req.flash('success_msg', 'Movie deleted successfully');
    res.redirect('/movies');
  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Error deleting movie');
    res.redirect('/movies');
  }
});

module.exports = router;