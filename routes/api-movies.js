const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const tmdbService = require('../services/tmdb');
const Movie = require('../models/Movie');

// Browse Movies Page
router.get('/browse', ensureAuthenticated, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const type = req.query.type || 'hollywood';
        const search = req.query.search || '';
        
        let data;
        if (search) {
            data = await tmdbService.searchMovies(search, page);
        } else if (type === 'hindi') {
            data = await tmdbService.getHindiMovies(page);
        } else {
            data = await tmdbService.getHollywoodMovies(page);
        }
        
        res.render('movies/browse', {
            movies: data.results || [],
            currentPage: page,
            totalPages: Math.min(data.total_pages || 1, 500),
            type: type,
            search: search,
            currentUrl: '/movies/browse'
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error fetching movies');
        res.redirect('/movies');
    }
});

// Add Movie from API to User Collection
router.post('/add-from-api', ensureAuthenticated, async (req, res) => {
    const { tmdbId, title, releaseYear, rating, posterPath, overview, watchStatus } = req.body;
    
    try {
        // Check if movie already exists in user's collection
        const existingMovie = await Movie.findOne({
            user: req.user.id,
            tmdbId: tmdbId
        });
        
        if (existingMovie) {
            req.flash('error_msg', 'Movie already in your collection');
            return res.redirect('/movies/browse');
        }
        
        // Determine genre (simplified)
        let genre = 'General';
        
        const newMovie = new Movie({
            title: title,
            genre: genre,
            releaseYear: parseInt(releaseYear),
            rating: parseFloat(rating),
            watchStatus: watchStatus || 'planning',
            user: req.user.id,
            posterPath: posterPath,
            tmdbId: parseInt(tmdbId),
            overview: overview,
            isFromApi: true
        });
        
        await newMovie.save();
        req.flash('success_msg', `"${title}" added to your ${watchStatus === 'watched' ? 'watched' : watchStatus === 'favorite' ? 'favorites' : 'watchlist'}!`);
        res.redirect('/movies');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error adding movie to collection');
        res.redirect('/movies/browse');
    }
});

module.exports = router;