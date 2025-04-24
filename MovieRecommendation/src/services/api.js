import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Movie API endpoints
export const fetchMovies = async (page = 1, limit = 20, sortBy = 'popularity') => {
  try {
    const response = await apiClient.get(`/movies?page=${page}&limit=${limit}&sort=${sortBy}`);
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