// TMDB API Configuration
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Check if API key is configured
export const isApiKeyConfigured = () => {
  return API_KEY && API_KEY !== '' && API_KEY !== 'your_api_key_here';
};

// You can get a free API key from https://www.themoviedb.org/settings/api

export const getImageUrl = (path, size = 'w500') => {
  if (!path) {
    // Return a data URI placeholder instead of external URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgZmlsbD0iIzIyMjIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchPopularMovies = async (page = 1) => {
  if (!isApiKeyConfigured()) {
    console.warn('TMDB API key not configured. Please add REACT_APP_TMDB_API_KEY to your .env file');
    return { results: [], total_pages: 0, error: 'API_KEY_MISSING' };
  }
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to fetch movies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { results: [], total_pages: 0, error: error.message };
  }
};

export const fetchTopRatedMovies = async (page = 1) => {
  if (!isApiKeyConfigured()) {
    return { results: [], total_pages: 0, error: 'API_KEY_MISSING' };
  }
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to fetch movies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return { results: [], total_pages: 0, error: error.message };
  }
};

export const fetchUpcomingMovies = async (page = 1) => {
  if (!isApiKeyConfigured()) {
    return { results: [], total_pages: 0, error: 'API_KEY_MISSING' };
  }
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to fetch movies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return { results: [], total_pages: 0, error: error.message };
  }
};

export const fetchNowPlayingMovies = async (page = 1) => {
  if (!isApiKeyConfigured()) {
    return { results: [], total_pages: 0, error: 'API_KEY_MISSING' };
  }
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to fetch movies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return { results: [], total_pages: 0, error: error.message };
  }
};

export const fetchMovieDetails = async (movieId) => {
  if (!isApiKeyConfigured()) {
    return null;
  }
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to fetch movie details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const searchMovies = async (query, page = 1) => {
  if (!isApiKeyConfigured()) {
    return { results: [], total_pages: 0, error: 'API_KEY_MISSING' };
  }
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to search movies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    return { results: [], total_pages: 0, error: error.message };
  }
};

export const fetchTrendingMovies = async (timeWindow = 'day') => {
  if (!isApiKeyConfigured()) {
    return { results: [], error: 'API_KEY_MISSING' };
  }
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to fetch trending movies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { results: [], error: error.message };
  }
};

export const fetchGenres = async () => {
  if (!isApiKeyConfigured()) {
    return { genres: [] };
  }
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to fetch genres');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching genres:', error);
    return { genres: [] };
  }
};

export const discoverMovies = async (filters = {}, page = 1) => {
  if (!isApiKeyConfigured()) {
    return { results: [], total_pages: 0, error: 'API_KEY_MISSING' };
  }
  try {
    const params = new URLSearchParams();
    params.append('api_key', API_KEY);
    params.append('page', page.toString());

    // Add filter parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        if (Array.isArray(filters[key])) {
          params.append(key, filters[key].join(','));
        } else {
          params.append(key, filters[key].toString());
        }
      }
    });

    const response = await fetch(
      `${BASE_URL}/discover/movie?${params.toString()}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || 'Failed to discover movies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error discovering movies:', error);
    return { results: [], total_pages: 0, error: error.message };
  }
};

