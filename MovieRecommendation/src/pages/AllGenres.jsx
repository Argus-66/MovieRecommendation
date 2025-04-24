import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGenres } from '../services/api';
import './AllGenres.css';

const AllGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        setLoading(true);
        const data = await fetchGenres();
        setGenres(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres. Please try again later.');
        setLoading(false);
      }
    };

    getGenres();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="all-genres-container">
      <header className="page-header">
        <h1 className="page-title">All Movie Genres</h1>
        <p className="page-description">
          Browse movies by your favorite genre
        </p>
      </header>

      <div className="genres-grid">
        {genres.map(genre => (
          <Link 
            key={genre.id} 
            to={`/genre/${genre.id}`} 
            className="genre-card"
          >
            <div className="genre-name">{genre.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllGenres; 