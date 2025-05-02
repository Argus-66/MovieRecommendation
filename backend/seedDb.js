import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import Movie from './models/Movie.js';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file if it exists (for local development)
try {
  const envPath = join(dirname(__dirname), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    // Apply the environment variables
    for (const key in envConfig) {
      process.env[key] = envConfig[key];
    }
    console.log('Loaded environment variables from .env file');
  } else {
    console.log('.env file not found, using environment variables from system');
  }
} catch (error) {
  console.log('Using environment variables from system');
}

// Sample movie data
const sampleMovies = [
  {
    index: 1,
    budget: 237000000,
    genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 878, name: "Science Fiction" }],
    homepage: "http://www.avatarmovie.com/",
    id: 19995,
    keywords: [{ id: 1463, name: "culture clash" }, { id: 2964, name: "future" }],
    original_language: "en",
    original_title: "Avatar",
    overview: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    popularity: 150.437577,
    production_companies: [{ name: "Ingenious Film Partners", id: 289 }, { name: "Twentieth Century Fox Film Corporation", id: 306 }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }, { iso_3166_1: "GB", name: "United Kingdom" }],
    release_date: "12/10/2009",
    revenue: 2787965087,
    runtime: 162,
    spoken_languages: [{ iso_639_1: "en", name: "English" }, { iso_639_1: "es", name: "Español" }],
    poster_path: "/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg",
    vote_average: 7.2,
    vote_count: 11800,
    tagline: "Enter the World of Pandora."
  },
  {
    index: 2,
    budget: 300000000,
    genres: [{ id: 12, name: "Adventure" }, { id: 14, name: "Fantasy" }, { id: 28, name: "Action" }],
    homepage: "https://www.facebook.com/PiratesOfTheCaribbean",
    id: 285,
    keywords: [{ id: 270, name: "ocean" }, { id: 726, name: "exotic island" }, { id: 911, name: "east india trading company" }],
    original_language: "en",
    original_title: "Pirates of the Caribbean: At World's End",
    overview: "Captain Barbossa, long believed to be dead, has come back to life and is headed to the edge of the Earth with Will Turner and Elizabeth Swann. But nothing is quite as it seems.",
    popularity: 139.082615,
    production_companies: [{ name: "Walt Disney Pictures", id: 2 }, { name: "Jerry Bruckheimer Films", id: 130 }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    release_date: "5/19/2007",
    revenue: 961000000,
    runtime: 169,
    spoken_languages: [{ iso_639_1: "en", name: "English" }],
    poster_path: "/2YMnBRh8F6fDGCCEIPk9Hb0cEyB.jpg",
    vote_average: 6.9,
    vote_count: 4500,
    tagline: "At the end of the world, the adventure begins."
  },
  {
    index: 3,
    budget: 250000000,
    genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 878, name: "Science Fiction" }],
    homepage: "http://www.transformersmovie.com/",
    id: 91314,
    keywords: [{ id: 1721, name: "transformer" }, { id: 3803, name: "aftermath" }],
    original_language: "en",
    original_title: "Transformers: Dark of the Moon",
    overview: "Sam Witwicky takes his first tenuous steps into adulthood while remaining a reluctant human ally of Autobot-leader Optimus Prime. The film centers around the space race between the USSR and the USA, suggesting there was a hidden Transformers role in it all that remains one of the planet's most dangerous secrets.",
    popularity: 56.118701,
    production_companies: [{ name: "Paramount Pictures", id: 4 }, { name: "Hasbro", id: 41 }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    release_date: "6/28/2011",
    revenue: 1123794079,
    runtime: 154,
    spoken_languages: [{ iso_639_1: "en", name: "English" }],
    poster_path: "/1BgN7JobaC3bDpLkSZBDoVYKMjr.jpg",
    vote_average: 6.1,
    vote_count: 3629,
    tagline: "The Invasion Will Not Be Stopped..."
  }
];

async function seedDatabase() {
  console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Check if there are already movies in the database
    const count = await Movie.countDocuments();
    console.log(`Found ${count} existing movies in the database`);

    if (count === 0) {
      // Insert sample movies
      const result = await Movie.insertMany(sampleMovies);
      console.log(`Added ${result.length} sample movies to the database`);
    } else {
      console.log('Database already has movies, skipping seed');
    }

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedDatabase(); 