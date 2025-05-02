import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGenres } from '../services/api';
import './AllGenres.css';

// Genre image URLs for common genres
const genreImages = {
  "Action": "https://images.unsplash.com/photo-1571941096834-95ffc8020000?q=80&w=500&auto=format&fit=crop",
  "Adventure": "https://images.unsplash.com/photo-1530064161350-7523c1341f0c?q=80&w=500&auto=format&fit=crop",
  "Animation": "https://images.unsplash.com/photo-1521727857535-28d0fadfe4c7?q=80&w=500&auto=format&fit=crop",
  "Comedy": "https://images.unsplash.com/photo-1518039501122-100d06db4a32?q=80&w=500&auto=format&fit=crop",
  "Crime": "https://images.unsplash.com/photo-1587842304657-cd1c01d8ca1c?q=80&w=500&auto=format&fit=crop",
  "Documentary": "https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=500&auto=format&fit=crop",
  "Drama": "https://images.unsplash.com/photo-1563895093305-5aa3c528e9eb?q=80&w=500&auto=format&fit=crop",
  "Family": "https://images.unsplash.com/photo-1542037907809-ac92dc737cd1?q=80&w=500&auto=format&fit=crop",
  "Fantasy": "https://images.unsplash.com/photo-1518709594023-6ebd2b0892a8?q=80&w=500&auto=format&fit=crop",
  "History": "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=500&auto=format&fit=crop",
  "Horror": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500&auto=format&fit=crop",
  "Music": "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=500&auto=format&fit=crop",
  "Mystery": "https://images.unsplash.com/photo-1593672587524-9025e33f1d55?q=80&w=500&auto=format&fit=crop",
  "Romance": "https://images.unsplash.com/photo-1517911041065-4960bd475886?q=80&w=500&auto=format&fit=crop",
  "Science Fiction": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500&auto=format&fit=crop",
  "TV Movie": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=500&auto=format&fit=crop",
  "Thriller": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop",
  "War": "https://images.unsplash.com/photo-1580424917967-a8867a6e676e?q=80&w=500&auto=format&fit=crop",
  "Western": "https://images.unsplash.com/photo-1533106958148-daaeab8b83fe?q=80&w=500&auto=format&fit=crop"
};

// Default image for genres not in the list
const defaultImage = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop";

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

  // Get genre image
  const getGenreImage = (genreName) => {
    return genreImages[genreName] || defaultImage;
  };

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
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${getGenreImage(genre.name)})`
            }}
          >
            <div className="genre-name">{genre.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllGenres; 