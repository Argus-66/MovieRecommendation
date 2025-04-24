import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file manually
const envPath = join(dirname(__dirname), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Apply the environment variables
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

// Movie schema
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
  spoken_languages: Array
}, {
  collection: 'movies'
});

const Movie = mongoose.model('Movie', movieSchema);

async function testMovies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Get total count
    const count = await Movie.countDocuments();
    console.log(`Total movies in database: ${count}`);

    // Get 5 movies
    const movies = await Movie.find().limit(5);
    console.log('\nSample movies:');
    movies.forEach((movie, index) => {
      console.log(`\n[${index + 1}] ${movie.original_title}`);
      console.log(`   - Overview: ${movie.overview.substring(0, 100)}...`);
      console.log(`   - Release Date: ${movie.release_date}`);
      console.log(`   - Genres: ${JSON.stringify(movie.genres)}`);
    });

    // Get available genres
    const uniqueGenres = await Movie.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: '$genres' } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nAvailable Genres:');
    console.log(uniqueGenres.map(g => g._id).join(', '));

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (err) {
    console.error('Error testing movies:', err);
  }
}

testMovies(); 