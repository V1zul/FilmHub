# Video Sources Setup

## Current Implementation

The video player currently uses iframe embeds from vidsrc, which means controls are limited. To enable full controls (play, pause, seek, skip), you need to extract actual video sources.

## Getting Video Sources

Due to CORS restrictions, you'll need a backend proxy to extract video sources from vidsrc. Here's how:

### Option 1: Backend Proxy (Recommended)

Create a backend endpoint that:
1. Fetches the vidsrc embed page
2. Parses the HTML/JavaScript to find video sources
3. Extracts m3u8 or mp4 URLs
4. Returns sources and subtitles in this format:

```json
{
  "sources": [
    {
      "src": "https://example.com/video.m3u8",
      "type": "application/x-mpegURL"
    },
    {
      "src": "https://example.com/video.mp4",
      "type": "video/mp4"
    }
  ],
  "subtitles": [
    {
      "src": "https://example.com/subtitles.vtt",
      "srclang": "en",
      "label": "English",
      "default": true
    },
    {
      "src": "https://example.com/subtitles-es.vtt",
      "srclang": "es",
      "label": "Spanish",
      "default": false
    }
  ]
}
```

### Option 2: Environment Variable

Set `REACT_APP_VIDEO_PROXY_URL` in your `.env` file:

```
REACT_APP_VIDEO_PROXY_URL=http://localhost:3001/api/video-source
```

Your proxy endpoint should accept:
- `url` query parameter with the embed URL
- Return the sources and subtitles JSON

### Example Backend (Node.js/Express)

```javascript
app.get('/api/video-source', async (req, res) => {
  const embedUrl = req.query.url;
  
  // Fetch embed page
  const response = await fetch(embedUrl, {
    headers: {
      'Referer': 'https://vidsrc.cc/',
      'User-Agent': 'Mozilla/5.0...'
    }
  });
  
  const html = await response.text();
  
  // Parse HTML to extract video sources
  // This is simplified - actual implementation would need proper parsing
  const sources = extractSources(html);
  const subtitles = extractSubtitles(html);
  
  res.json({ sources, subtitles });
});
```

## Current Features

Even with iframe fallback, the player includes:
- ✅ Server/Provider selection
- ✅ Subtitle menu (when sources available)
- ✅ Volume control
- ✅ Fullscreen
- ⚠️ Play/Pause/Seek (limited with iframe)
- ⚠️ Skip 10 seconds (limited with iframe)

With actual video sources, all features work fully!

