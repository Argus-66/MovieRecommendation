import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from '../models/Movie.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to run Python recommendation service
const runPythonRecommendation = (command, args) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', 'recommendation_service.py');
    const fullCommand = `python ${pythonScript} ${command} ${args.join(' ')}`;
    
    exec(fullCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Python recommendation error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Python recommendation stderr: ${stderr}`);
      }
      
      try {
        const results = JSON.parse(stdout);
        resolve(results);
      } catch (parseError) {
        console.error(`Error parsing Python output: ${parseError.message}`);
        reject(parseError);
      }
    });
  });
};

// Helper function to parse date string into a Date object
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  // Format: MM/DD/YYYY
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
};

// Get all movies with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'popularity';
    
    // Count total movies for pagination
    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);
    
    // Determine sort field
    let sortField = { popularity: -1 }; // Default sort
    
    if (sort) {
      switch (sort) {
        case 'release_date':
          sortField = { release_date: -1 }; // Latest first
          break;
        case 'original_title':
          sortField = { original_title: 1 }; // A-Z
          break;
        case 'vote_average':
          sortField = { vote_average: -1 }; // Highest rating first
          break;
        default:
          sortField = { popularity: -1 };
      }
    }
    
    const movies = await Movie.find()
      .sort(sortField)
      .skip(skip)
      .limit(limit);
    
    res.json({
      movies,
      totalPages,
      currentPage: page,
      totalMovies
    });
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie by ID
router.get('/id/:id', async (req, res) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id });
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (err) {
    console.error('Error fetching movie:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search movies
router.get('/search/:query', async (req, res) => {
  try {
    const searchRegex = new RegExp(req.params.query, 'i');
    
    const movies = await Movie.find({
      $or: [
        { original_title: searchRegex },
        { overview: searchRegex }
      ]
    }).limit(20);
    
    res.json(movies);
  } catch (err) {
    console.error('Error searching movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular movies
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const movies = await Movie.find()
      .sort({ popularity: -1 })
      .limit(limit);
    
    res.json(movies);
  } catch (err) {
    console.error('Error fetching popular movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movies by genre
router.get('/genre/:genreId', async (req, res) => {
  try {
    const genreId = parseInt(req.params.genreId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'popularity';
    
    // Determine sort field
    let sortField = { popularity: -1 }; // Default sort
    
    if (sort) {
      switch (sort) {
        case 'release_date':
          sortField = { release_date: -1 };
          break;
        case 'original_title':
          sortField = { original_title: 1 };
          break;
        case 'vote_average':
          sortField = { vote_average: -1 };
          break;
        default:
          sortField = { popularity: -1 };
      }
    }
    
    const movies = await Movie.find({ 'genres.id': genreId })
      .sort(sortField)
      .skip(skip)
      .limit(limit);
    
    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies by genre:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all genres
router.get('/genres', async (req, res) => {
  try {
    // Get unique genres from all movies
    const movies = await Movie.find({}, { genres: 1 });
    
    // Extract and flatten all genres
    const allGenres = movies.flatMap(movie => movie.genres || []);
    
    // Filter unique genres by ID
    const uniqueGenres = Array.from(
      new Map(allGenres.map(genre => [genre.id, genre])).values()
    );
    
    // Sort genres alphabetically
    uniqueGenres.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(uniqueGenres);
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Filter movies
router.get('/filter', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'popularity';
    const genreId = req.query.genre ? parseInt(req.query.genre) : null;
    const query = req.query.query || '';
    const yearFrom = req.query.yearFrom ? parseInt(req.query.yearFrom) : null;
    const yearTo = req.query.yearTo ? parseInt(req.query.yearTo) : null;
    
    // Build filter conditions
    const filter = {};
    
    // Add search query if provided
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { original_title: searchRegex },
        { overview: searchRegex }
      ];
    }
    
    // Add genre filter if provided
    if (genreId) {
      filter['genres.id'] = genreId;
    }
    
    // Add year range filter if provided
    if (yearFrom || yearTo) {
      filter.release_date = {};
      
      if (yearFrom) {
        filter.release_date.$gte = `01/01/${yearFrom}`;
      }
      
      if (yearTo) {
        filter.release_date.$lte = `31/12/${yearTo}`;
      }
    }
    
    // Determine sort field
    let sortField = { popularity: -1 }; // Default sort
    
    if (sort) {
      switch (sort) {
        case 'release_date':
          sortField = { release_date: -1 };
          break;
        case 'original_title':
          sortField = { original_title: 1 };
          break;
        case 'vote_average':
          sortField = { vote_average: -1 };
          break;
        default:
          sortField = { popularity: -1 };
      }
    }
    
    // Get total count for pagination
    const totalMovies = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(totalMovies / limit);
    
    // Get filtered movies
    const movies = await Movie.find(filter)
      .sort(sortField)
      .skip(skip)
      .limit(limit);
    
    res.json({
      movies,
      totalPages,
      currentPage: page,
      totalMovies
    });
  } catch (err) {
    console.error('Error filtering movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get random movie recommendations using Python
router.get('/random', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    
    try {
      // Try to use Python recommendation service first
      const recommendations = await runPythonRecommendation('random', [count]);
      return res.json(recommendations);
    } catch (pythonError) {
      console.error('Failed to use Python for recommendations, falling back to MongoDB:', pythonError);
      
      // Fallback to MongoDB if Python fails
      const movies = await Movie.aggregate([
        { $match: { vote_average: { $gte: 6 } } },
        { $sample: { size: count } }
      ]);
      
      res.json(movies);
    }
  } catch (err) {
    console.error('Error fetching random recommendations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get similar movies using Python recommendation system
router.get('/similar/:movieId', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const count = parseInt(req.query.count) || 5;
    
    // Try to use Python recommendation service first
    try {
      const recommendations = await runPythonRecommendation('similar', [movieId, count]);
      return res.json(recommendations);
    } catch (pythonError) {
      console.error('Failed to use Python for similar movies, falling back to MongoDB:', pythonError);
      
      // Fallback to MongoDB if Python fails
      // Get the movie to find similar ones
      const movie = await Movie.findOne({ id: movieId });
      
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      
      // Extract genre IDs from the movie
      const genreIds = movie.genres.map(genre => genre.id);
      
      // Find movies with at least one matching genre, excluding the current movie
      const similarMovies = await Movie.find({
        id: { $ne: movieId },
        'genres.id': { $in: genreIds }
      })
      .sort({ vote_average: -1, popularity: -1 })
      .limit(count);
      
      res.json(similarMovies);
    }
  } catch (err) {
    console.error('Error fetching similar movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommendations by preferences using Python
router.get('/recommend', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const genreIds = req.query.genres ? req.query.genres.split(',').map(id => parseInt(id)) : [];
    const year = req.query.year ? parseInt(req.query.year) : null;
    const minRating = req.query.rating ? parseFloat(req.query.rating) : 7.0;
    
    try {
      // Try to use Python recommendation service first
      const genresArg = genreIds.length > 0 ? genreIds.join(',') : 'null';
      const yearArg = year ? year.toString() : 'null';
      const args = [genresArg, yearArg, minRating.toString(), count.toString()];
      
      const recommendations = await runPythonRecommendation('preferences', args);
      return res.json(recommendations);
    } catch (pythonError) {
      console.error('Failed to use Python for preference recommendations, falling back to MongoDB:', pythonError);
      
      // Fallback to MongoDB if Python fails
      // Build filter
      const filter = {
        vote_average: { $gte: minRating }
      };
      
      // Add genre filter if provided
      if (genreIds.length > 0) {
        filter['genres.id'] = { $in: genreIds };
      }
      
      // Add year filter if provided
      if (year) {
        // Create regex to match year in date string (DD/MM/YYYY)
        const yearRegex = new RegExp(`\\d{2}/\\d{2}/${year}$`);
        filter.release_date = yearRegex;
      }
      
      // Get recommendations
      const recommendations = await Movie.find(filter)
        .sort({ vote_average: -1, popularity: -1 })
        .limit(count);
      
      res.json(recommendations);
    }
  } catch (err) {
    console.error('Error getting recommendations by preferences:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 