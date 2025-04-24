const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favoriteMovies', 'title posterPath voteAverage');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add movie to favorites
router.put('/:id/favorites', async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (!user.favoriteMovies.includes(movieId)) {
      user.favoriteMovies.push(movieId);
      await user.save();
    }
    
    res.json(user.favoriteMovies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove movie from favorites
router.delete('/:id/favorites/:movieId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.favoriteMovies = user.favoriteMovies.filter(
      id => id.toString() !== req.params.movieId
    );
    
    await user.save();
    res.json(user.favoriteMovies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add movie to watchlist
router.put('/:id/watchlist', async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }
    
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user preferences (genres)
router.put('/:id/preferences', async (req, res) => {
  try {
    const { favoriteGenres } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.favoriteGenres = favoriteGenres;
    await user.save();
    
    res.json(user.favoriteGenres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 