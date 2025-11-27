import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  if (!movie) return null;

  const releaseDate = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card-image-container">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="movie-card-image"
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <div className="movie-card-rating">
            <span className="rating-icon">⭐</span>
            <span className="rating-value">
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-year">{releaseDate}</p>
      </div>
    </Link>
  );
};

export default MovieCard;

