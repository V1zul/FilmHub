# Quick Setup - Enable Video Controls

## Problem
The video player controls (play, pause, seek, skip, volume, subtitles) are disabled because the player is using an iframe embed, which doesn't allow direct control.

## Solution 1: Enable Demo Mode (Easiest - For Testing)

1. Open your `.env` file in the root directory
2. Add this line:
   ```
   REACT_APP_USE_DEMO_VIDEO=true
   ```
3. Save the file
4. Restart your development server:
   ```bash
   npm start
   ```

Now all controls will work with a sample video so you can test the player features!

## Solution 2: Set Up Backend Proxy (For Production)

To get actual video sources from vidsrc and enable controls with real movies:

1. Set up a backend server (Node.js/Express, Python/Flask, etc.)
2. Create an endpoint that extracts video sources from vidsrc embeds
3. Add to your `.env`:
   ```
   REACT_APP_VIDEO_PROXY_URL=http://localhost:3001/api/video-source
   ```
4. See `VIDEO_SOURCES.md` for detailed implementation

## Current Status

- ✅ All controls are visible
- ⚠️ Controls are disabled when using iframe (no video sources)
- ✅ Demo mode available for testing
- ✅ Server selection works
- ✅ Subtitle menu ready (when sources available)

## Note

Demo mode is now enabled by default if no proxy is configured. To disable it, set:
```
REACT_APP_USE_DEMO_VIDEO=false
```

