import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// Helper function to parse date string into a Date object
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  // Format: MM/DD/YYYY
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
};

// Get all movies with pagination and sorting
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Determine sort field and direction
    let sortField = { popularity: -1 }; // Default sort by popularity desc
    
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'popularity':
          sortField = { popularity: -1 };
          break;
        case 'release_date':
          sortField = { release_date: -1 }; // Recent first
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
    
    const totalMovies = await Movie.countDocuments();
    
    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
      totalMovies
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get movie by ID
router.get('/id/:id', async (req, res) => {
  try {
    // Use the movie ID from the database
    const movie = await Movie.findOne({ id: parseInt(req.params.id) });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: err.message });
  }
});

// Search movies by title
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const movies = await Movie.find({
      original_title: { $regex: searchQuery, $options: 'i' }
    }).limit(20);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get movies by genre with pagination and sorting
router.get('/genre/:genreId', async (req, res) => {
  try {
    const genreId = parseInt(req.params.genreId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Determine sort field and direction
    let sortField = { popularity: -1 }; // Default sort by popularity desc
    
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'popularity':
          sortField = { popularity: -1 };
          break;
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
    
    const query = { 'genres.id': genreId };
    
    const movies = await Movie.find(query)
      .sort(sortField)
      .skip(skip)
      .limit(limit);
    
    const totalMovies = await Movie.countDocuments(query);
    
    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
      totalMovies
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Advanced filter endpoint
router.get('/filter', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Genre filter
    if (req.query.genre) {
      query['genres.id'] = parseInt(req.query.genre);
    }
    
    // Text search
    if (req.query.query) {
      query.original_title = { $regex: req.query.query, $options: 'i' };
    }
    
    // Year range
    if (req.query.yearFrom || req.query.yearTo) {
      query.release_date = {};
      
      if (req.query.yearFrom) {
        // Create date string for first day of the year
        const fromDate = `01/01/${req.query.yearFrom}`;
        query.release_date.$gte = fromDate;
      }
      
      if (req.query.yearTo) {
        // Create date string for last day of the year
        const toDate = `12/31/${req.query.yearTo}`;
        query.release_date.$lte = toDate;
      }
    }
    
    // Sorting
    let sortField = { popularity: -1 }; // Default
    
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'popularity':
          sortField = { popularity: -1 };
          break;
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
    
    const movies = await Movie.find(query)
      .sort(sortField)
      .skip(skip)
      .limit(limit);
    
    const totalMovies = await Movie.countDocuments(query);
    
    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
      totalMovies
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all unique genres
router.get('/genres', async (req, res) => {
  try {
    // First, unwind the genres array, then group by genre name and id
    const genres = await Movie.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: { id: '$genres.id', name: '$genres.name' } } },
      { $project: { _id: 0, id: '$_id.id', name: '$_id.name' } },
      { $sort: { name: 1 } }
    ]);
    
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; 