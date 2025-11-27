import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTrendingMovies, getImageUrl } from '../services/api';
import './FeaturedSlider.css';

const FeaturedSlider = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchTrendingMovies('day');
        if (data.results && data.results.length > 0) {
          setMovies(data.results.slice(0, 10)); // Get top 10 trending
        }
      } catch (error) {
        console.error('Error loading featured movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Touch swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (loading || movies.length === 0) {
    return (
      <div className="featured-slider loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="featured-slider">
      <div 
        className="slider-background"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(10,10,10,0.95)), url(${getImageUrl(currentMovie.backdrop_path, 'w1280')})`
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="slider-content">
          <div className="slider-info">
            <h2 className="slider-title">{currentMovie.title}</h2>
            <div className="slider-meta">
              <span className="slider-rating">
                ⭐ {currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span className="slider-year">
                {currentMovie.release_date ? new Date(currentMovie.release_date).getFullYear() : 'N/A'}
              </span>
            </div>
            <p className="slider-overview">
              {currentMovie.overview 
                ? (currentMovie.overview.length > 200 
                    ? currentMovie.overview.substring(0, 200) + '...' 
                    : currentMovie.overview)
                : 'No overview available.'}
            </p>
            <div className="slider-buttons">
              <Link to={`/movie/${currentMovie.id}`} className="slider-button">
                View Details →
              </Link>
              <Link to={`/movie/${currentMovie.id}#watch`} className="slider-button slider-button-watch">
                ▶ Watch Now
              </Link>
            </div>
          </div>
        </div>

        <button className="slider-nav slider-nav-prev" onClick={goToPrevious}>
          ‹
        </button>
        <button className="slider-nav slider-nav-next" onClick={goToNext}>
          ›
        </button>

        <div className="slider-indicators">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`slider-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSlider;

