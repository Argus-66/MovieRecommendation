import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMovies, fetchPopularMovies, fetchGenres } from '../services/api';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [sortBy, setSortBy] = useState('popularity');
  const [filterGenre, setFilterGenre] = useState('');
  const [yearRange, setYearRange] = useState({ min: 1900, max: 2023 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get popular movies
        const popular = await fetchPopularMovies(10);
        setPopularMovies(popular);
        
        // Get latest movies with pagination
        const { movies, totalPages: pages, currentPage: page } = await fetchMovies(currentPage, 20, sortBy);
        setAllMovies(movies);
        setTotalPages(pages);
        setCurrentPage(page);
        
        // Get 10 latest movies for latest section
        const { movies: latest } = await fetchMovies(1, 10, 'release_date');
        setLatestMovies(latest);
        
        // Get all genres
        const genreList = await fetchGenres();
        setGenres(genreList);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortBy]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to the movies section
      document.getElementById('all-movies').scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  // Filter all movies by genre
  const filteredMovies = filterGenre 
    ? allMovies.filter(movie => 
        movie.genres && movie.genres.some(genre => 
          genre.id === parseInt(filterGenre)
        )
      )
    : allMovies;
  
  if (loading && currentPage === 1) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Amazing Movies</h1>
          <p className="hero-subtitle">Browse through thousands of movies and find your next favorite</p>
        </div>
      </section>
      
      <section className="section">
        <h2 className="section-title">Popular Movies</h2>
        <div className="movie-grid">
          {popularMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      
      <section className="section">
        <h2 className="section-title">Latest Releases</h2>
        <div className="movie-grid">
          {latestMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      
      <section className="section">
        <h2 className="section-title">Browse by Genre</h2>
        <div className="genre-list">
          {genres.map(genre => (
            <Link key={genre.id} to={`/genre/${genre.id}`} className="genre-item">
              {genre.name}
            </Link>
          ))}
        </div>
      </section>
      
      <section id="all-movies" className="section">
        <div className="section-header">
          <h2 className="section-title">All Movies</h2>
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="popularity">Popularity</option>
                <option value="release_date">Release Date</option>
                <option value="original_title">Title (A-Z)</option>
                <option value="vote_average">Rating</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="genre-select">Genre:</label>
              <select 
                id="genre-select" 
                value={filterGenre} 
                onChange={(e) => setFilterGenre(e.target.value)}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading && currentPage > 1 ? (
          <div className="loading-more">Loading more movies...</div>
        ) : (
          <>
            <div className="movie-grid">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {filteredMovies.length === 0 && (
              <div className="no-results">
                <p>No movies found with the selected filters.</p>
              </div>
            )}
            
            {filteredMovies.length > 0 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home; 