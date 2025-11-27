import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies, discoverMovies, fetchGenres } from '../services/api';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const genreParam = searchParams.get('genre') || '';
  const yearParam = searchParams.get('year') || '';
  const ratingParam = searchParams.get('rating') || '';
  const sortParam = searchParams.get('sort') || 'popularity.desc';
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(genreParam ? genreParam.split(',').map(Number) : []);
  const [selectedYear, setSelectedYear] = useState(yearParam || '');
  const [selectedRating, setSelectedRating] = useState(ratingParam || '');
  const [sortBy, setSortBy] = useState(sortParam);
  const [useDiscover, setUseDiscover] = useState(!query);

  useEffect(() => {
    const loadGenres = async () => {
      const data = await fetchGenres();
      if (data.genres) {
        setGenres(data.genres);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    if (query) {
      setUseDiscover(false);
      performSearch(query, 1);
    } else {
      setUseDiscover(true);
      performDiscover(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedGenres.join(','), selectedYear, selectedRating, sortBy]);

  const performSearch = async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchMovies(searchQuery, pageNum);
      if (pageNum === 1) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      setTotalPages(data.total_pages || 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Error searching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const performDiscover = async (pageNum = 1) => {
    setLoading(true);
    try {
      const filters = {
        sort_by: sortBy,
      };

      if (selectedGenres.length > 0) {
        filters.with_genres = selectedGenres.join(',');
      }

      if (selectedYear) {
        filters.year = selectedYear;
      }

      if (selectedRating) {
        filters['vote_average.gte'] = selectedRating;
      }

      const data = await discoverMovies(filters, pageNum);
      if (pageNum === 1) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      setTotalPages(data.total_pages || 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Error discovering movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
      setUseDiscover(false);
      performSearch(searchInput.trim(), 1);
    }
  };

  const handleGenreToggle = (genreId) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(newGenres);
    const params = new URLSearchParams(searchParams);
    if (newGenres.length > 0) {
      params.set('genre', newGenres.join(','));
    } else {
      params.delete('genre');
    }
    setSearchParams(params);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    const params = new URLSearchParams(searchParams);
    if (year) {
      params.set('year', year);
    } else {
      params.delete('year');
    }
    setSearchParams(params);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    const params = new URLSearchParams(searchParams);
    if (rating) {
      params.set('rating', rating);
    } else {
      params.delete('rating');
    }
    setSearchParams(params);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedYear('');
    setSelectedRating('');
    setSortBy('popularity.desc');
    setSearchParams({});
  };

  const loadMore = () => {
    if (page < totalPages && !loading) {
      if (useDiscover) {
        performDiscover(page + 1);
      } else if (query) {
        performSearch(query, page + 1);
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1 className="search-title">Discover Movies</h1>
          <p className="search-subtitle">Search for your favorite movies and explore new ones</p>
        </div>

        <form onSubmit={handleSubmit} className="search-form-large">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input-large"
          />
          <button type="submit" className="search-button-large" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {!query && (
          <div className="filters-section">
            <div className="filters-header">
              <h2>Filters</h2>
              {(selectedGenres.length > 0 || selectedYear || selectedRating || sortBy !== 'popularity.desc') && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All
                </button>
              )}
            </div>

            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Genres</label>
                <div className="genre-chips">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      type="button"
                      className={`genre-chip ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                      onClick={() => handleGenreToggle(genre.id)}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Minimum Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any Rating</option>
                  <option value="8">8+</option>
                  <option value="7">7+</option>
                  <option value="6">6+</option>
                  <option value="5">5+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="vote_average.desc">Rating</option>
                  <option value="release_date.desc">Newest</option>
                  <option value="release_date.asc">Oldest</option>
                  <option value="title.asc">Title (A-Z)</option>
                  <option value="title.desc">Title (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading && movies.length === 0 && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching movies...</p>
          </div>
        )}

        {!loading && query && movies.length === 0 && (
          <div className="no-results">
            <h2>No movies found</h2>
            <p>Try searching with different keywords</p>
          </div>
        )}

        {movies.length > 0 && (
          <>
            <div className="search-results-header">
              <h2>
                {query ? `Search Results for "${query}"` : 'Discover Movies'}
                {totalPages > 0 && (
                  <span className="result-count"> ({movies.length} of many)</span>
                )}
              </h2>
            </div>

            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {page < totalPages && (
              <div className="load-more-container">
                <button onClick={loadMore} className="load-more-button" disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}

        {!query && movies.length === 0 && !loading && (
          <div className="search-placeholder">
            <div className="placeholder-icon">🎬</div>
            <h2>Discover Movies</h2>
            <p>Use the filters above to find movies by genre, year, rating, and more</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

