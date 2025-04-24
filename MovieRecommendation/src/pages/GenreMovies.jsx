import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMoviesByGenre, fetchGenres } from '../services/api';
import MovieCard from '../components/MovieCard';
import './GenreMovies.css';

const GenreMovies = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all genres to find current genre name
        const genreList = await fetchGenres();
        setAllGenres(genreList);
        
        const currentGenre = genreList.find(g => g.id === parseInt(id));
        if (currentGenre) {
          setGenre(currentGenre);
        }
        
        // Fetch movies by genre
        const genreMovies = await fetchMoviesByGenre(id);
        setMovies(genreMovies);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching genre movies:', err);
        setError('Failed to fetch movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="genre-page">
      <div className="genre-header">
        <h1 className="genre-title">{genre ? genre.name : 'Genre'} Movies</h1>
        
        <div className="other-genres">
          <span className="other-genres-label">Other Genres:</span>
          <div className="genre-pills">
            {allGenres
              .filter(g => g.id !== parseInt(id))
              .slice(0, 10)
              .map(g => (
                <Link key={g.id} to={`/genre/${g.id}`} className="genre-pill">
                  {g.name}
                </Link>
              ))
            }
          </div>
        </div>
      </div>
      
      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="no-movies">
          <p>No movies found for this genre.</p>
        </div>
      )}
    </div>
  );
};

export default GenreMovies; 