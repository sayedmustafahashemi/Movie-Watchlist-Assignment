const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const tmdbService = {
    // Fetch Hindi Movies (Bollywood)
    async getHindiMovies(page = 1) {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    with_original_language: 'hi',
                    sort_by: 'popularity.desc',
                    page: page,
                    region: 'IN'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Hindi movies:', error);
            return { results: [], total_pages: 0 };
        }
    },

    // Fetch Hollywood Movies
    async getHollywoodMovies(page = 1) {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    with_original_language: 'en',
                    sort_by: 'popularity.desc',
                    page: page,
                    'vote_average.gte': 6
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Hollywood movies:', error);
            return { results: [], total_pages: 0 };
        }
    },

    // Search Movies
    async searchMovies(query, page = 1) {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
                params: {
                    api_key: API_KEY,
                    query: query,
                    page: page,
                    include_adult: false
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching movies:', error);
            return { results: [], total_pages: 0 };
        }
    },

    // Get Movie Details
    async getMovieDetails(movieId) {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
                params: {
                    api_key: API_KEY,
                    append_to_response: 'credits,similar'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    }
};

module.exports = tmdbService;