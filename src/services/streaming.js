// Streaming service providers configuration
// Based on streamium: https://github.com/gmonarque/streamium

const STREAMING_PROVIDERS = {
  vidsrc: {
    name: 'VidSrc',
    baseUrl: 'https://vidsrc.cc/v2/embed',
    getUrl: (movieId) => `https://vidsrc.cc/v2/embed/movie/${movieId}`,
    icon: '🎬'
  },
  vidsrcPro: {
    name: 'VidSrc Pro',
    baseUrl: 'https://vidsrc.pro/embed',
    getUrl: (movieId) => `https://vidsrc.pro/embed/movie/${movieId}`,
    icon: '⭐'
  },
  embedSu: {
    name: 'EmbedSU',
    baseUrl: 'https://embed.su/embed',
    getUrl: (movieId) => `https://embed.su/embed/movie/${movieId}`,
    icon: '🎥'
  },
  vidsrcTo: {
    name: 'VidSrc.to',
    baseUrl: 'https://vidsrc.to/embed',
    getUrl: (movieId) => `https://vidsrc.to/embed/movie/${movieId}`,
    icon: '📺'
  }
};

export const getStreamingUrl = (provider, movieId) => {
  const providerConfig = STREAMING_PROVIDERS[provider];
  if (!providerConfig) {
    return null;
  }
  return providerConfig.getUrl(movieId);
};

export const getAvailableProviders = () => {
  return Object.keys(STREAMING_PROVIDERS).map(key => ({
    id: key,
    ...STREAMING_PROVIDERS[key]
  }));
};

export const getDefaultProvider = () => {
  return 'vidsrc';
};

export default STREAMING_PROVIDERS;
