import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchMovies, 
  fetchPopularMovies, 
  fetchGenres, 
  getRandomRecommendations,
  getSimilarMovies,
  getRecommendationsByPreferences,
  searchMovies
} from '../services/api';
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
  
  // Recommendation states
  const [randomRecommendations, setRandomRecommendations] = useState([]);
  const [randomRecommendCount, setRandomRecommendCount] = useState(5);
  const [randomRecommendationsLoading, setRandomRecommendationsLoading] = useState(false);
  
  const [similarMovies, setSimilarMovies] = useState([]);
  const [movieForSimilar, setMovieForSimilar] = useState('');
  const [similarCount, setSimilarCount] = useState(5);
  const [similarMoviesLoading, setSimilarMoviesLoading] = useState(false);
  
  const [preferenceRecommendations, setPreferenceRecommendations] = useState([]);
  const [preferenceGenres, setPreferenceGenres] = useState([]);
  const [preferenceYear, setPreferenceYear] = useState('');
  const [preferenceRating, setPreferenceRating] = useState(7);
  const [preferenceCount, setPreferenceCount] = useState(5);
  const [preferenceRecommendationsLoading, setPreferenceRecommendationsLoading] = useState(false);
  
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
  
  // Get random recommendations
  const handleRandomRecommendations = async () => {
    setRandomRecommendationsLoading(true);
    try {
      const recommendations = await getRandomRecommendations(randomRecommendCount);
      setRandomRecommendations(recommendations);
    } catch (err) {
      console.error('Error fetching random recommendations:', err);
    } finally {
      setRandomRecommendationsLoading(false);
    }
  };
  
  // Get similar movies recommendations
  const handleSimilarMovies = async () => {
    if (!movieForSimilar.trim()) return;
    
    setSimilarMoviesLoading(true);
    try {
      // First search for the movie
      const searchResults = await searchMovies(movieForSimilar);
      
      if (searchResults && searchResults.length > 0) {
        // Use the first result's ID
        const movieId = searchResults[0].id;
        const similar = await getSimilarMovies(movieId, similarCount);
        setSimilarMovies(similar);
        
        if (similar.length === 0) {
          setError('No similar movies found. Try a different movie.');
        }
      } else {
        // No movie found
        setSimilarMovies([]);
        setError('Movie not found. Please check the title and try again.');
      }
    } catch (err) {
      console.error('Error fetching similar movies:', err);
      setError('Failed to fetch similar movies. Please try again later.');
    } finally {
      setSimilarMoviesLoading(false);
    }
  };
  
  // Get recommendations based on preferences
  const handlePreferenceRecommendations = async () => {
    setPreferenceRecommendationsLoading(true);
    try {
      const preferences = {
        genres: preferenceGenres,
        year: preferenceYear ? parseInt(preferenceYear) : null,
        rating: preferenceRating,
        count: preferenceCount
      };
      
      const recommendations = await getRecommendationsByPreferences(preferences);
      setPreferenceRecommendations(recommendations);
    } catch (err) {
      console.error('Error fetching preference recommendations:', err);
    } finally {
      setPreferenceRecommendationsLoading(false);
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
      <section className="hero-section full-width">
        <div className="hero-content">
          <h1 className="hero-title">Discover Amazing Movies</h1>
          <p className="hero-subtitle">Find your next favorite movie with personalized recommendations</p>
          <div className="hero-actions">
            <a href="#recommendation-center" className="hero-button">Get Recommendations</a>
            <a href="#all-movies" className="hero-button secondary">Browse Movies</a>
          </div>
        </div>
      </section>
      
      {/* Recommendation Center Section */}
      <section id="recommendation-center" className="section recommendation-center full-width">
        <h2 className="section-title">Movie Recommendation Center</h2>
        
        <div className="recommendation-options">
          {/* Random Recommendations */}
          <div className="recommendation-option">
            <h3 className="recommendation-option-title">Random Recommendations</h3>
            <div className="recommendation-form">
              <div className="form-group">
                <label>Number of movies:</label>
                <select
                  value={randomRecommendCount}
                  onChange={(e) => setRandomRecommendCount(parseInt(e.target.value))}
                  className="form-select"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
              <button 
                onClick={handleRandomRecommendations}
                className="recommendation-button"
                disabled={randomRecommendationsLoading}
              >
                {randomRecommendationsLoading ? 'Loading...' : 'Recommend Movies'}
              </button>
            </div>
            
            {randomRecommendations.length > 0 && (
              <div className="recommendation-results">
                <h4>Your Random Recommendations</h4>
                <div className="movie-grid">
                  {randomRecommendations.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Similar Movies Recommendations */}
          <div className="recommendation-option">
            <h3 className="recommendation-option-title">If You Like This Movie</h3>
            <div className="recommendation-form">
              <div className="form-group">
                <label>Movie title:</label>
                <input
                  type="text"
                  value={movieForSimilar}
                  onChange={(e) => setMovieForSimilar(e.target.value)}
                  placeholder="Enter a movie title"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Number of recommendations:</label>
                <select
                  value={similarCount}
                  onChange={(e) => setSimilarCount(parseInt(e.target.value))}
                  className="form-select"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
              <button 
                onClick={handleSimilarMovies}
                className="recommendation-button"
                disabled={similarMoviesLoading || !movieForSimilar.trim()}
              >
                {similarMoviesLoading ? 'Loading...' : 'Find Similar Movies'}
              </button>
            </div>
            
            {similarMovies.length > 0 && (
              <div className="recommendation-results">
                <h4>Similar Movies You Might Enjoy</h4>
                <div className="movie-grid">
                  {similarMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Preference-based Recommendations */}
          <div className="recommendation-option">
            <h3 className="recommendation-option-title">Personalized Recommendations</h3>
            <div className="recommendation-form">
              <div className="form-group">
                <label>Genres:</label>
                <select
                  multiple
                  value={preferenceGenres}
                  onChange={(e) => setPreferenceGenres(
                    Array.from(e.target.selectedOptions, option => parseInt(option.value))
                  )}
                  className="form-select form-select-multiple"
                >
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                <small>Hold Ctrl/Cmd to select multiple</small>
              </div>
              <div className="form-group">
                <label>Release year:</label>
                <input
                  type="number"
                  value={preferenceYear}
                  onChange={(e) => setPreferenceYear(e.target.value)}
                  placeholder="e.g. 2020"
                  min="1900"
                  max="2023"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Minimum rating: {preferenceRating}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={preferenceRating}
                  onChange={(e) => setPreferenceRating(parseFloat(e.target.value))}
                  className="form-range"
                />
              </div>
              <div className="form-group">
                <label>Number of recommendations:</label>
                <select
                  value={preferenceCount}
                  onChange={(e) => setPreferenceCount(parseInt(e.target.value))}
                  className="form-select"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
              <button 
                onClick={handlePreferenceRecommendations}
                className="recommendation-button"
                disabled={preferenceRecommendationsLoading}
              >
                {preferenceRecommendationsLoading ? 'Loading...' : 'Get Recommendations'}
              </button>
            </div>
            
            {preferenceRecommendations.length > 0 && (
              <div className="recommendation-results">
                <h4>Your Personalized Recommendations</h4>
                <div className="movie-grid">
                  {preferenceRecommendations.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="section full-width">
        <h2 className="section-title">Popular Movies</h2>
        <div className="movie-grid">
          {popularMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      
      <section className="section full-width">
        <h2 className="section-title">Latest Releases</h2>
        <div className="movie-grid">
          {latestMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      
      <section className="section full-width">
        <h2 className="section-title">Browse by Genre</h2>
        <div className="genre-list">
          {genres.map(genre => (
            <Link key={genre.id} to={`/genre/${genre.id}`} className="genre-item">
              {genre.name}
            </Link>
          ))}
        </div>
      </section>
      
      <section id="all-movies" className="section full-width">
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