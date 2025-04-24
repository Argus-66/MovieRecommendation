import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGenres } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showGenresDropdown, setShowGenresDropdown] = useState(false);
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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
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
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          
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