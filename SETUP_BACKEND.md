# Backend Setup Guide

## Quick Start

### Option 1: Start Both Servers Together (Recommended)

```bash
npm run dev
```

This will start both the backend (port 3001) and frontend (port 3000) servers.

### Option 2: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm install  # First time only
npm start
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## Configuration

### Frontend `.env` file

Add this line to your frontend `.env` file (in the root directory):

```
REACT_APP_VIDEO_PROXY_URL=http://localhost:3001/api/video-source
```

The frontend will automatically use this proxy if available.

### Backend `.env` file (Optional)

The backend server defaults to port 3001. To change it, create `server/.env`:

```
PORT=3001
```

## How It Works

1. **Frontend** requests video sources for a movie
2. **Backend** receives the vidsrc embed URL
3. **Backend** fetches and parses the embed page
4. **Backend** extracts video sources (m3u8, mp4) and subtitles
5. **Frontend** receives sources and uses HTML5 video player
6. **All controls work!** ✅

## API Endpoint

The backend provides one main endpoint:

### `GET /api/video-source?url=<embed_url>`

**Example:**
```
http://localhost:3001/api/video-source?url=https://vidsrc.cc/v2/embed/movie/123
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

## Troubleshooting

### Backend won't start
- Make sure port 3001 is not in use
- Check that dependencies are installed: `cd server && npm install`

### No video sources found
- Check backend console logs for errors
- Some vidsrc embeds may use different structures
- The backend will return the embed URL as fallback

### Frontend can't connect to backend
- Make sure backend is running on port 3001
- Check `REACT_APP_VIDEO_PROXY_URL` in frontend `.env`
- Check browser console for CORS errors

### Controls still don't work
- Check browser console for errors
- Verify backend is returning sources (check Network tab)
- Try restarting both servers

## Testing

1. Start both servers: `npm run dev`
2. Open a movie detail page
3. Check browser console - you should see: "✅ Video sources extracted successfully"
4. All controls should now work!

## Production Deployment

For production, you'll need to:
1. Deploy the backend server (Heroku, Railway, Render, etc.)
2. Update `REACT_APP_VIDEO_PROXY_URL` to your production backend URL
3. Ensure CORS is configured for your frontend domain

