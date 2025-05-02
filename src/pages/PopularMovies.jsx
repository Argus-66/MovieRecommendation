import { useState, useEffect } from 'react';
import { fetchPopularMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import './PopularMovies.css';

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchPopularMovies(50);
        setMovies(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching popular movies:', err);
        setError('Failed to load popular movies. Please try again later.');
        setLoading(false);
      }
    };

    getPopularMovies();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="popular-movies-container">
      <header className="page-header">
        <h1 className="page-title">Most Popular Movies</h1>
        <p className="page-description">
          Discover the most popular movies based on audience ratings and viewership
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

export default PopularMovies; 