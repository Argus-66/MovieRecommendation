import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieById } from '../services/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovie = async () => {
      try {
        setLoading(true);
        const data = await fetchMovieById(id);
        setMovie(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      }
    };

    getMovie();
  }, [id]);
  
  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Format currency amounts
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format release date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    return date instanceof Date && !isNaN(date) 
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Unknown date';
  };

  // Get release year
  const getYear = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    return date instanceof Date && !isNaN(date) ? `(${date.getFullYear()})` : '';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  return (
    <div className="movie-details-container">
      <div className="movie-details-content">
        <div className="movie-header">
          <h1 className="movie-details-title">
            {movie.original_title} {getYear(movie.release_date)}
          </h1>
          
          {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}
          
          <div className="movie-metadata">
            <span className="movie-date">{formatDate(movie.release_date)}</span>
            {movie.runtime > 0 && <span className="movie-runtime">{formatRuntime(movie.runtime)}</span>}
            {movie.vote_average > 0 && (
              <span className="movie-rating-badge">
                {Number(movie.vote_average).toFixed(1)}/10
              </span>
            )}
          </div>
          
          <div className="movie-genres">
            {movie.genres && movie.genres.map(genre => (
              <Link 
                key={genre.id} 
                to={`/genre/${genre.id}`} 
                className="genre-tag"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="movie-main-content">
          <div className="movie-overview-section">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
          
          <div className="movie-details-grid">
            {movie.budget > 0 && (
              <div className="detail-item">
                <h4>Budget</h4>
                <p>{formatCurrency(movie.budget)}</p>
              </div>
            )}
            
            {movie.revenue > 0 && (
              <div className="detail-item">
                <h4>Revenue</h4>
                <p>{formatCurrency(movie.revenue)}</p>
              </div>
            )}
            
            {movie.original_language && (
              <div className="detail-item">
                <h4>Language</h4>
                <p>{movie.original_language.toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 