const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  favoriteGenres: [{
    type: String
  }],
  favoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  watchedMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 