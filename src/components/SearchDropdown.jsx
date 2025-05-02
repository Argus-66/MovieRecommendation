import { Link } from 'react-router-dom';
import './SearchDropdown.css';

const SearchDropdown = ({ results, loading, onResultClick }) => {
  if (results.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="search-dropdown">
      {loading ? (
        <div className="search-dropdown-loading">
          <p>Searching...</p>
        </div>
      ) : (
        <ul className="search-dropdown-results">
          {results.slice(0, 5).map(movie => (
            <li key={movie.id} className="search-dropdown-item">
              <Link 
                to={`/movie/${movie.id}`} 
                className="search-dropdown-link"
                onClick={onResultClick}
              >
                <div className="search-result-content">
                  <div className="search-result-title">{movie.original_title}</div>
                  {movie.release_date && (
                    <div className="search-result-year">
                      {movie.release_date.substring(0, 4)}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
          {results.length > 5 && (
            <li className="search-dropdown-item search-dropdown-more">
              <Link 
                to={`/search/${results[0]?.query}`} 
                className="search-dropdown-link search-dropdown-more-link"
                onClick={onResultClick}
              >
                View all {results.length} results
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown; 