// Ad blocking utilities for video player
// This helps prevent ads from appearing in embedded iframes

const AD_DOMAINS = [
  'doubleclick',
  'googleads',
  'advertising',
  'ads.',
  '/ads/',
  'popup',
  'popunder',
  'adserver',
  'adnetwork',
  'advertising.com',
  'adsystem',
  'adservice',
  'adtech',
  'adform',
  'adnxs',
  'advertising.net'
];

export const blockCommonAdPatterns = () => {
  // This runs in the parent window, not the iframe
  // We can't directly access iframe content due to CORS, but we can:
  // 1. Monitor for popup windows
  // 2. Block certain iframe behaviors
  // 3. Add CSS to hide common ad patterns

  // Block popup windows from iframe
  const originalOpen = window.open;
  window.open = function(url, target, features) {
    // Block popups that might be ads
    if (url) {
      const lowerUrl = url.toLowerCase();
      const isAd = AD_DOMAINS.some(domain => lowerUrl.includes(domain));
      
      if (isAd) {
        console.log('🚫 Blocked potential ad popup:', url);
        return null;
      }
    }
    return originalOpen.apply(this, arguments);
  };

  // Block focus stealing (common ad technique)
  let lastFocus = document.activeElement;
  setInterval(() => {
    if (document.activeElement !== lastFocus && 
        document.activeElement.tagName === 'IFRAME' &&
        !document.activeElement.closest('.video-player-wrapper')) {
      lastFocus.focus();
    }
    lastFocus = document.activeElement;
  }, 100);

  // Monitor for new windows and block ad-related ones
  window.addEventListener('beforeunload', (e) => {
    const href = window.location.href.toLowerCase();
    const isAd = AD_DOMAINS.some(domain => href.includes(domain));
    
    if (isAd) {
      e.preventDefault();
      window.stop();
      return (e.returnValue = '');
    }
  });
};

export const setupAdBlocking = () => {
  if (typeof window !== 'undefined') {
    blockCommonAdPatterns();
  }
};

export default setupAdBlocking;

