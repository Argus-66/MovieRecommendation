import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Log the API URL for debugging
console.log('API URL:', API_URL);

// Movie API endpoints
export const fetchMovies = async (page = 1, limit = 20, sortBy = 'popularity') => {
  try {
    console.log(`Fetching movies from: ${API_URL}/api/movies`);
    const response = await apiClient.get(`/api/movies?page=${page}&limit=${limit}&sort=${sortBy}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchMovieById = async (id) => {
  try {
    const response = await apiClient.get(`/movies/id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie with id ${id}:`, error);
    throw error;
  }
};

export const fetchPopularMovies = async (limit = 10) => {
  try {
    const response = await apiClient.get(`/movies/popular?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const fetchNewestMovies = async (limit = 10) => {
  try {
    const response = await apiClient.get(`/movies?page=1&limit=${limit}&sort=release_date`);
    return response.data.movies;
  } catch (error) {
    console.error('Error fetching newest movies:', error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await apiClient.get(`/movies/search/${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching movies with query "${query}":`, error);
    throw error;
  }
};

export const fetchMoviesByGenre = async (genreId, page = 1, limit = 20, sortBy = 'popularity') => {
  try {
    const response = await apiClient.get(
      `/movies/genre/${genreId}?page=${page}&limit=${limit}&sort=${sortBy}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies with genre id ${genreId}:`, error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await apiClient.get('/movies/genres');
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const filterMovies = async (filters) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.genreId) params.append('genre', filters.genreId);
    if (filters.query) params.append('query', filters.query);
    if (filters.yearFrom) params.append('yearFrom', filters.yearFrom);
    if (filters.yearTo) params.append('yearTo', filters.yearTo);
    
    const response = await apiClient.get(`/movies/filter?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error filtering movies:', error);
    throw error;
  }
};

// Recommendation API endpoints
export const getRandomRecommendations = async (count = 5) => {
  try {
    const response = await apiClient.get(`/movies/random?count=${count}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random recommendations:', error);
    throw error;
  }
};

export const getSimilarMovies = async (movieId, count = 5) => {
  try {
    const response = await apiClient.get(`/movies/similar/${movieId}?count=${count}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching similar movies for movie ID ${movieId}:`, error);
    throw error;
  }
};

export const getRecommendationsByPreferences = async (preferences) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (preferences.genres) params.append('genres', preferences.genres.join(','));
    if (preferences.year) params.append('year', preferences.year);
    if (preferences.count) params.append('count', preferences.count);
    if (preferences.rating) params.append('rating', preferences.rating);
    
    const response = await apiClient.get(`/movies/recommend?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations by preferences:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${API_URL}/api/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for movie ID ${movieId}:`, error);
    throw error;
  }
}; 