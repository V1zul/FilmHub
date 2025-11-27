import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails, getImageUrl } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieDetails(id);
        if (data) {
          setMovie(data);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMovieDetails();
    }

    // Scroll to watch section if hash is present
    if (window.location.hash === '#watch') {
      setTimeout(() => {
        const watchSection = document.querySelector('.streaming-section');
        if (watchSection) {
          watchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error || 'Movie not found'}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Go Back Home
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTrailerUrl = () => {
    if (movie.videos && movie.videos.results) {
      const trailer = movie.videos.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer) {
        return `https://www.youtube.com/embed/${trailer.key}`;
      }
    }
    return null;
  };

  const trailerUrl = getTrailerUrl();

  return (
    <div className="movie-detail">
      <div
        className="movie-detail-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(10,10,10,0.95)), url(${getImageUrl(movie.backdrop_path, 'w1280')})`
        }}
      >
        <div className="movie-detail-container">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
          
          <div className="movie-detail-content">
            <div className="movie-detail-poster">
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="poster-image"
              />
            </div>

            <div className="movie-detail-info">
              <h1 className="movie-detail-title">{movie.title}</h1>
              
              <div className="movie-detail-meta">
                <span className="meta-item">
                  <span className="meta-label">Release:</span>
                  {formatDate(movie.release_date)}
                </span>
                <span className="meta-item">
                  <span className="meta-label">Runtime:</span>
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="meta-item rating">
                  <span className="rating-icon">⭐</span>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  <span className="vote-count">({movie.vote_count} votes)</span>
                </span>
              </div>

              <div className="movie-detail-genres">
                {movie.genres && movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="movie-detail-overview">
                <h3>Overview</h3>
                <p>{movie.overview || 'No overview available.'}</p>
              </div>

              {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
                <div className="movie-detail-cast">
                  <h3>Cast</h3>
                  <div className="cast-list">
                    {movie.credits.cast.slice(0, 10).map((actor) => (
                      <div key={actor.id} className="cast-item">
                        <img
                          src={getImageUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          className="cast-image"
                        />
                        <p className="cast-name">{actor.name}</p>
                        <p className="cast-character">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="streaming-section">
        <div className="movie-detail-container">
          <VideoPlayer movieId={movie.id} movieTitle={movie.title} />
        </div>
      </div>

      {trailerUrl && (
        <div className="trailer-section">
          <div className="movie-detail-container">
            <h2 className="trailer-title">Trailer</h2>
            <div className="trailer-container">
              <iframe
                src={trailerUrl}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="trailer-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;

