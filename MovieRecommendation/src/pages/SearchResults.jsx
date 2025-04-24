import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import './SearchResults.css';

const SearchResults = () => {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const results = await searchMovies(query);
        setMovies(results);
        setLoading(false);
      } catch (err) {
        console.error('Error searching movies:', err);
        setError('Failed to search movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return <div className="loading">Searching...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="search-results">
      <h1 className="search-title">Search Results for "{query}"</h1>
      
      {movies.length > 0 ? (
        <>
          <p className="results-count">{movies.length} results found</p>
          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      ) : (
        <div className="no-results">
          <p>No movies found matching "{query}".</p>
          <p>Try different keywords or browse by genre.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 