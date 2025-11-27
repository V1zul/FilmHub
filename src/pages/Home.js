import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import FeaturedSlider from '../components/FeaturedSlider';
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchNowPlayingMovies } from '../services/api';
import './Home.css';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const [popular, topRated, trending, nowPlaying] = await Promise.all([
          fetchPopularMovies(1),
          fetchTopRatedMovies(1),
          fetchTrendingMovies('day'),
          fetchNowPlayingMovies(1)
        ]);

        setPopularMovies(popular.results || []);
        setTopRatedMovies(topRated.results || []);
        setTrendingMovies(trending.results || []);
        setNowPlayingMovies(nowPlaying.results || []);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const MovieSection = ({ title, movies }) => {
    if (!movies || movies.length === 0) return null;

    return (
      <section className="movie-section">
        <h2 className="section-title">{title}</h2>
        <div className="movie-grid">
          {movies.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing movies...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <FeaturedSlider />
      
      <div className="home-content">
        <MovieSection title="🔥 Trending Now" movies={trendingMovies} />
        <MovieSection title="🎬 Now Playing" movies={nowPlayingMovies} />
        <MovieSection title="⭐ Popular Movies" movies={popularMovies} />
        <MovieSection title="🏆 Top Rated" movies={topRatedMovies} />
      </div>
    </div>
  );
};

export default Home;

