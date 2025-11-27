import React, { useState, useEffect, useRef } from 'react';
import { getVideoSource, getAvailableProviders, getDefaultProvider } from '../services/streaming';
import './CustomVideoPlayer.css';

const CustomVideoPlayer = ({ 
  movieId, 
  movieTitle, 
  isTVShow = false,
  seasonNumber = 1,
  episodeNumber = 1,
  onNextEpisode,
  hasNextEpisode = false
}) => {
  const videoRef = useRef(null);
  const [selectedProvider, setSelectedProvider] = useState(getDefaultProvider());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoSources, setVideoSources] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const controlsTimeoutRef = useRef(null);
  const playerRef = useRef(null);
  const providers = getAvailableProviders();

  // Intro detection (typically 0-90 seconds)
  const INTRO_END_TIME = 90;

  const loadVideo = async () => {
    setLoading(true);
    setError(null);
    try {
      const type = isTVShow ? 'tv' : 'movie';
      const source = await getVideoSource(selectedProvider, movieId, type, seasonNumber, episodeNumber);
      
      if (source && source.sources && source.sources.length > 0) {
        // We have actual video sources - use HTML5 video
        setVideoSources(source.sources);
        setSubtitles(source.subtitles || []);
        setUseIframe(false);
        setIframeUrl(null);
        
        // Set default subtitle if available
        if (source.subtitles && source.subtitles.length > 0) {
          const defaultSub = source.subtitles.find(s => s.default) || source.subtitles[0];
          setSelectedSubtitle(defaultSub);
        }
      } else if (source && source.embedUrl) {
        // Fallback to iframe
        setUseIframe(true);
        setIframeUrl(source.embedUrl);
        setVideoSources([]);
        setSubtitles([]);
      } else {
        setError('Unable to load video source');
      }
    } catch (err) {
      console.error('Error loading video:', err);
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideo();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, seasonNumber, episodeNumber, selectedProvider]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || useIframe) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      
      // Check for skip intro (first 90 seconds)
      if (video.currentTime < INTRO_END_TIME && video.currentTime > 10 && isTVShow) {
        setShowSkipIntro(true);
      } else {
        setShowSkipIntro(false);
      }

      // Check for next episode (last 10% of video)
      if (video.duration > 0 && video.currentTime > video.duration * 0.9 && hasNextEpisode) {
        setShowNextEpisode(true);
      } else {
        setShowNextEpisode(false);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (hasNextEpisode && onNextEpisode) {
        setShowNextEpisode(true);
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, [useIframe, hasNextEpisode, isTVShow, onNextEpisode]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video && !useIframe) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || useIframe) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (video && !useIframe) {
      video.currentTime = Math.min(video.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (video && !useIframe) {
      video.currentTime = Math.max(video.currentTime - 10, 0);
    }
  };

  const skipIntro = () => {
    const video = videoRef.current;
    if (video && !useIframe) {
      video.currentTime = INTRO_END_TIME;
      setShowSkipIntro(false);
    }
  };

  const handleNextEpisode = () => {
    if (onNextEpisode) {
      onNextEpisode();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video && !useIframe) {
      video.muted = !video.muted;
    }
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    if (video && !useIframe) {
      video.volume = newVolume;
      if (newVolume > 0) {
        video.muted = false;
      }
    }
  };


  const selectSubtitle = (subtitle) => {
    const video = videoRef.current;
    if (video && !useIframe) {
      const tracks = video.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = 'hidden';
      }
      
      if (subtitle) {
        const track = Array.from(tracks).find(t => t.language === subtitle.srclang);
        if (track) {
          track.mode = 'showing';
        }
        setSelectedSubtitle(subtitle);
      } else {
        setSelectedSubtitle(null);
      }
      setShowSubtitleMenu(false);
    }
  };

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId);
    setShowServerMenu(false);
  };

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;

    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen();
      } else if (player.msRequestFullscreen) {
        player.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="custom-player-loading">
        <div className="loading-spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-player-error">
        <p>⚠️ {error}</p>
        <button onClick={loadVideo} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div 
      className="custom-video-player"
      ref={playerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(true)}
    >
      <div className="video-container">
        {useIframe ? (
          <iframe
            src={iframeUrl}
            className="video-iframe"
            allowFullScreen
            frameBorder="0"
            scrolling="no"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={movieTitle}
            onLoad={() => setLoading(false)}
          />
        ) : (
          <video
            ref={videoRef}
            className="video-element"
            onDoubleClick={toggleFullscreen}
            onClick={togglePlay}
          >
            {videoSources.map((source, index) => (
              <source key={index} src={source.src} type={source.type} />
            ))}
            {subtitles.map((subtitle, index) => (
              <track
                key={index}
                kind="subtitles"
                srcLang={subtitle.srclang}
                label={subtitle.label}
                src={subtitle.src}
                default={subtitle.default}
              />
            ))}
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Skip Intro Button */}
        {showSkipIntro && isTVShow && !useIframe && (
          <div className="skip-intro-button" onClick={skipIntro}>
            <span className="skip-icon">⏭</span>
            <span>Skip Intro</span>
          </div>
        )}

        {/* Next Episode Button */}
        {showNextEpisode && hasNextEpisode && (
          <div className="next-episode-overlay">
            <div className="next-episode-content">
              <h3>Up Next</h3>
              <p>Episode {episodeNumber + 1}</p>
              <button onClick={handleNextEpisode} className="next-episode-button">
                Next Episode →
              </button>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className={`controls-overlay ${showControls ? 'visible' : ''}`}>
          {/* Top Controls */}
          <div className="controls-top">
            <div className="video-title">{movieTitle}</div>
            <div className="controls-top-right">
              {/* Server Selection */}
              <div className="menu-container">
                <button 
                  className="control-button-top" 
                  onClick={() => setShowServerMenu(!showServerMenu)}
                  title="Select Server"
                >
                  <span>🌐</span> Server
                </button>
                {showServerMenu && (
                  <div className="menu-dropdown">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        className={`menu-item ${selectedProvider === provider.id ? 'active' : ''}`}
                        onClick={() => handleProviderChange(provider.id)}
                      >
                        <span>{provider.icon}</span> {provider.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Controls */}
          <div className="controls-center">
            <button className="control-button skip-backward" onClick={skipBackward} title="Rewind 10s" disabled={useIframe}>
              <span>⏪</span>
              <span className="skip-time">10</span>
            </button>
            <button className="control-button play-pause" onClick={togglePlay} disabled={useIframe}>
              {isPlaying ? <span>⏸</span> : <span>▶</span>}
            </button>
            <button className="control-button skip-forward" onClick={skipForward} title="Forward 10s" disabled={useIframe}>
              <span>⏩</span>
              <span className="skip-time">10</span>
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="controls-bottom">
            <div className="progress-container" onClick={handleSeek} style={{ cursor: useIframe ? 'not-allowed' : 'pointer' }}>
              <div className="progress-bar">
                <div 
                  className="progress-filled" 
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
                <div 
                  className="progress-handle" 
                  style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="controls-row">
              <div className="controls-left">
                <button className="control-button" onClick={togglePlay} disabled={useIframe}>
                  {isPlaying ? <span>⏸</span> : <span>▶</span>}
                </button>
                <button className="control-button" onClick={skipBackward} title="Rewind 10s" disabled={useIframe}>
                  ⏪ 10
                </button>
                <button className="control-button" onClick={skipForward} title="Forward 10s" disabled={useIframe}>
                  10 ⏩
                </button>
                <div className="volume-control">
                  <button className="control-button" onClick={toggleMute} disabled={useIframe}>
                    {isMuted || volume === 0 ? <span>🔇</span> : <span>🔊</span>}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                    disabled={useIframe}
                  />
                </div>
                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                {/* Subtitle Control */}
                {subtitles.length > 0 && (
                  <div className="menu-container">
                    <button 
                      className="control-button" 
                      onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                      title="Subtitles"
                      disabled={useIframe}
                    >
                      <span>📝</span>
                    </button>
                    {showSubtitleMenu && (
                      <div className="menu-dropdown subtitle-menu">
                        <button
                          className={`menu-item ${!selectedSubtitle ? 'active' : ''}`}
                          onClick={() => selectSubtitle(null)}
                        >
                          Off
                        </button>
                        {subtitles.map((subtitle, index) => (
                          <button
                            key={index}
                            className={`menu-item ${selectedSubtitle?.srclang === subtitle.srclang ? 'active' : ''}`}
                            onClick={() => selectSubtitle(subtitle)}
                          >
                            {subtitle.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="controls-right">
                <button className="control-button" onClick={toggleFullscreen} title="Fullscreen">
                  <span>⛶</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {useIframe && (
        <div className="iframe-notice">
          <p><strong>⚠️ Limited Controls:</strong> Using embedded player. Controls are disabled because video sources aren't available.</p>
          <p className="notice-hint">
            <strong>Quick Fix:</strong> Add <code>REACT_APP_USE_DEMO_VIDEO=true</code> to your <code>.env</code> file and restart the server to test all controls with a sample video.
            <br /><br />
            <strong>For Production:</strong> Set up a backend proxy to extract video sources from vidsrc (see VIDEO_SOURCES.md)
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
