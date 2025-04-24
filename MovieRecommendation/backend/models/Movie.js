import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  index: Number,
  budget: Number,
  genres: Array,
  homepage: String,
  id: Number,
  keywords: Array,
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  production_companies: Array,
  production_countries: Array,
  release_date: String,
  revenue: Number,
  runtime: Number,
  spoken_languages: Array,
  // Add any additional fields that might be in the data
  poster_path: String,
  vote_average: Number,
  vote_count: Number,
  tagline: String
}, {
  collection: 'movies'
});

export default mongoose.model('Movie', movieSchema); 