# Backend Server - Video Source Proxy

This backend server extracts video sources from vidsrc embeds so the frontend video player can have full control (play, pause, seek, skip, subtitles).

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file (optional, defaults to port 3001):
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoint

### GET `/api/video-source`

Extracts video sources from a vidsrc embed URL.

**Query Parameters:**
- `url` (required): The vidsrc embed URL

**Example:**
```
GET http://localhost:3001/api/video-source?url=https://vidsrc.cc/v2/embed/movie/123
```

**Response:**
```json
{
  "embedUrl": "https://vidsrc.cc/v2/embed/movie/123",
  "sources": [
    {
      "src": "https://example.com/video.m3u8",
      "type": "application/x-mpegURL"
    }
  ],
  "subtitles": [
    {
      "src": "https://example.com/subtitles.vtt",
      "srclang": "en",
      "label": "English",
      "default": true
    }
  ],
  "extracted": true
}
```

## How It Works

1. Receives a vidsrc embed URL from the frontend
2. Fetches the embed page HTML
3. Parses the HTML/JavaScript to find video sources (m3u8, mp4)
4. Extracts subtitle URLs (vtt, srt)
5. Returns sources in a format the frontend can use

## Frontend Configuration

Add to your frontend `.env` file:
```
REACT_APP_VIDEO_PROXY_URL=http://localhost:3001/api/video-source
```

## Troubleshooting

- If no sources are found, the server returns the embed URL as fallback
- Check server logs for extraction errors
- Some vidsrc embeds may require additional parsing logic
- CORS is enabled for localhost development

