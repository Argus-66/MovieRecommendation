import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  // Format release date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    return date instanceof Date && !isNaN(date) 
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'Unknown date';
  };

  // Get genre names
  const genreNames = movie.genres && movie.genres.length > 0 
    ? movie.genres.map(g => g.name).slice(0, 2).join(', ') 
    : '';
    
  // Get year from release date
  const getYear = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    return date instanceof Date && !isNaN(date) ? `(${date.getFullYear()})` : '';
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-info">
          <h3 className="movie-title">{movie.original_title} {getYear(movie.release_date)}</h3>
          <p className="movie-date">{formatDate(movie.release_date)}</p>
          {genreNames && <p className="movie-genres-text">{genreNames}</p>}
          {movie.overview && (
            <p className="movie-overview-preview">{movie.overview.substring(0, 80)}...</p>
          )}
          {movie.vote_average > 0 && (
            <div className="movie-rating">
              {Number(movie.vote_average).toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard; 