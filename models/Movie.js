const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    watchStatus: {
        type: String,
        enum: ['planning', 'watched', 'favorite'],
        default: 'planning'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // New fields for API integration
    posterPath: {
        type: String,
        default: null
    },
    tmdbId: {
        type: Number,
        default: null
    },
    overview: {
        type: String,
        default: ''
    },
    isFromApi: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Movie', MovieSchema);