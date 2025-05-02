import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGenres, searchMovies } from '../services/api';
import SearchDropdown from './SearchDropdown';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [genres, setGenres] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showGenresDropdown, setShowGenresDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchFormRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genreList = await fetchGenres();
        setGenres(genreList);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    
    getGenres();
    
    // Add click event listener to close search dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input changes with debounce
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim().length > 1) {
      setIsSearching(true);
      // Set a timeout to avoid too many API calls while typing
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchMovies(query);
          // Add the query to each result for the "View all results" link
          results.forEach(movie => movie.query = query);
          setSearchResults(results);
        } catch (err) {
          console.error('Error searching movies:', err);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`);
      setSearchQuery('');
      setSearchResults([]);
      setShowMobileMenu(false);
    }
  };

  const handleSearchResultClick = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    if (showGenresDropdown) setShowGenresDropdown(false);
  };

  const toggleGenresDropdown = (e) => {
    e.preventDefault();
    setShowGenresDropdown(!showGenresDropdown);
  };

  // Close dropdown when navigating
  const handleGenreClick = () => {
    setShowGenresDropdown(false);
    setShowMobileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <Link to="/" className="navbar-logo">
            MovieFinder
          </Link>
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`burger-icon ${showMobileMenu ? 'open' : ''}`}></span>
          </button>
        </div>
        
        <div className={`navbar-menu ${showMobileMenu ? 'show' : ''}`}>
          <div className="search-container" ref={searchFormRef}>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
            <SearchDropdown 
              results={searchResults} 
              loading={isSearching}
              onResultClick={handleSearchResultClick}
            />
          </div>
          
          <div className="navbar-links">
            <Link to="/" className="navbar-link" onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
            <div className="dropdown">
              <a 
                href="#" 
                className="navbar-link dropdown-toggle" 
                onClick={toggleGenresDropdown}
              >
                Genres <span className="dropdown-arrow">▼</span>
              </a>
              {showGenresDropdown && (
                <div className="dropdown-menu">
                  {genres.slice(0, 10).map(genre => (
                    <Link 
                      key={genre.id} 
                      to={`/genre/${genre.id}`} 
                      className="dropdown-item"
                      onClick={handleGenreClick}
                    >
                      {genre.name}
                    </Link>
                  ))}
                  <Link to="/genres" className="dropdown-item view-all" onClick={handleGenreClick}>
                    View All Genres
                  </Link>
                </div>
              )}
            </div>
            <Link to="/popular" className="navbar-link" onClick={() => setShowMobileMenu(false)}>
              Popular
            </Link>
            <Link to="/newest" className="navbar-link" onClick={() => setShowMobileMenu(false)}>
              Newest
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 