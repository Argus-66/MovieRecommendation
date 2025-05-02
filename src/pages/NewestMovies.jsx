import { useState, useEffect } from 'react';
import { fetchNewestMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import './NewestMovies.css';

const NewestMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNewestMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchNewestMovies(50);
        setMovies(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching newest movies:', err);
        setError('Failed to load newest movies. Please try again later.');
        setLoading(false);
      }
    };

    getNewestMovies();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="newest-movies-container">
      <header className="page-header">
        <h1 className="page-title">Latest Releases</h1>
        <p className="page-description">
          Check out the newest movie releases, sorted by release date
        </p>
      </header>

      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default NewestMovies; 