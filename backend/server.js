import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import moviesRouter from './routes/movies.js';

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

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'https://movie-recommendation-frontend-rw3c.onrender.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Temporarily allow all origins for debugging
    }
  },
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Count movies to verify data access
    const Movie = mongoose.model('Movie');
    Movie.countDocuments()
      .then(count => {
        console.log(`Database contains ${count} movies`);
      })
      .catch(err => {
        console.error('Error counting movies:', err);
      });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.use('/api/movies', moviesRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Movie Recommendation API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 