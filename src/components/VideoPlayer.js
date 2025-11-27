import React, { useState, useEffect } from 'react';
import { getStreamingUrl, getAvailableProviders, getDefaultProvider } from '../services/streaming';
import { setupAdBlocking } from '../utils/adBlocker';
import './VideoPlayer.css';

const VideoPlayer = ({ movieId, movieTitle }) => {
  const [selectedProvider, setSelectedProvider] = useState(getDefaultProvider());
  const [streamingUrl, setStreamingUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const providers = getAvailableProviders();

  useEffect(() => {
    // Setup ad blocking when component mounts
    setupAdBlocking();
    
    if (movieId) {
      loadStream(movieId, selectedProvider);
    }
  }, [movieId, selectedProvider]);

  const loadStream = async (id, provider) => {
    setLoading(true);
    setError(null);
    
    const url = getStreamingUrl(provider, id);
    if (url) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setStreamingUrl(url);
        setLoading(false);
      }, 300);
    } else {
      setError('Unable to load streaming URL');
      setLoading(false);
    }
  };

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId);
  };

  if (!movieId) {
    return (
      <div className="video-player-error">
        <p>No movie ID provided</p>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <div className="video-player-header">
        <h3 className="video-player-title">Watch {movieTitle || 'Movie'}</h3>
        <div className="provider-selector">
          <label className="provider-label">Streaming Source:</label>
          <div className="provider-buttons">
            {providers.map((provider) => (
              <button
                key={provider.id}
                className={`provider-button ${selectedProvider === provider.id ? 'active' : ''}`}
                onClick={() => handleProviderChange(provider.id)}
                title={provider.name}
              >
                <span className="provider-icon">{provider.icon}</span>
                <span className="provider-name">{provider.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="video-player-loading">
          <div className="loading-spinner"></div>
          <p>Loading stream...</p>
        </div>
      )}

      {error && (
        <div className="video-player-error">
          <p>⚠️ {error}</p>
          <p className="error-hint">Try selecting a different streaming source</p>
          {streamingUrl && (
            <a 
              href={streamingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="error-link"
            >
              Open in New Tab →
            </a>
          )}
        </div>
      )}

      {streamingUrl && !loading && (
        <div className="video-player-wrapper">
          <div className="iframe-container">
            <iframe
              src={streamingUrl}
              className="video-player-iframe"
              allowFullScreen
              frameBorder="0"
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              title={`Streaming ${movieTitle || 'movie'}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
            ></iframe>
            {/* Ad blocker overlay - blocks common ad patterns */}
            <div className="ad-blocker-overlay"></div>
          </div>
          <div className="iframe-fallback">
            <p>If the video doesn't load, try:</p>
            <ul>
              <li>Selecting a different streaming source</li>
              <li>Using an ad blocker extension (uBlock Origin recommended)</li>
              <li>Opening in a new tab: <a href={streamingUrl} target="_blank" rel="noopener noreferrer">Open Stream</a></li>
            </ul>
          </div>
        </div>
      )}

      <div className="video-player-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This streaming feature is provided for educational purposes only. 
          Please ensure you have the legal right to stream the content in your jurisdiction.
        </p>
        <p className="disclaimer-note">
          <strong>Tip:</strong> For the best experience with minimal ads, we recommend using an ad blocker extension 
          like uBlock Origin. The player includes built-in popup blocking, but an ad blocker provides additional protection.
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;

