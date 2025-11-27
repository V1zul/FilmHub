const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to extract video sources from vidsrc embed
async function extractVideoSources(embedUrl) {
  try {
    // Fetch the embed page
    const response = await axios.get(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://vidsrc.cc/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const sources = [];
    const subtitles = [];

    // Method 1: Look for video sources in script tags
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html() || '';
      
      // Look for m3u8 URLs
      const m3u8Matches = scriptContent.match(/https?:\/\/[^\s"']+\.m3u8[^\s"']*/g);
      if (m3u8Matches) {
        m3u8Matches.forEach(url => {
          if (!sources.find(s => s.src === url)) {
            sources.push({
              src: url,
              type: 'application/x-mpegURL'
            });
          }
        });
      }

      // Look for mp4 URLs
      const mp4Matches = scriptContent.match(/https?:\/\/[^\s"']+\.mp4[^\s"']*/g);
      if (mp4Matches) {
        mp4Matches.forEach(url => {
          if (!sources.find(s => s.src === url)) {
            sources.push({
              src: url,
              type: 'video/mp4'
            });
          }
        });
      }

      // Look for subtitle URLs (vtt, srt)
      const vttMatches = scriptContent.match(/https?:\/\/[^\s"']+\.vtt[^\s"']*/g);
      const srtMatches = scriptContent.match(/https?:\/\/[^\s"']+\.srt[^\s"']*/g);
      
      if (vttMatches) {
        vttMatches.forEach((url, index) => {
          subtitles.push({
            src: url,
            srclang: 'en',
            label: `English ${index > 0 ? index + 1 : ''}`.trim(),
            default: index === 0
          });
        });
      }
      
      if (srtMatches) {
        srtMatches.forEach((url, index) => {
          subtitles.push({
            src: url,
            srclang: 'en',
            label: `English ${index > 0 ? index + 1 : ''}`.trim(),
            default: index === 0 && subtitles.length === 0
          });
        });
      }
    });

    // Method 2: Look for iframe sources that might contain video
    $('iframe').each((i, elem) => {
      const iframeSrc = $(elem).attr('src');
      if (iframeSrc && (iframeSrc.includes('.m3u8') || iframeSrc.includes('.mp4'))) {
        sources.push({
          src: iframeSrc,
          type: iframeSrc.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
        });
      }
    });

    // Method 3: Look for video tags
    $('video source').each((i, elem) => {
      const src = $(elem).attr('src');
      const type = $(elem).attr('type') || 'video/mp4';
      if (src && !sources.find(s => s.src === src)) {
        sources.push({ src, type });
      }
    });

    // Method 4: Try to extract from common vidsrc patterns
    // Vidsrc often uses specific patterns in their JavaScript
    const vidsrcPatterns = [
      /player\.src\s*=\s*['"]([^'"]+)['"]/g,
      /source:\s*['"]([^'"]+)['"]/g,
      /file:\s*['"]([^'"]+)['"]/g,
      /url:\s*['"]([^'"]+)['"]/g
    ];

    $('script').each((i, elem) => {
      const scriptContent = $(elem).html() || '';
      vidsrcPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(scriptContent)) !== null) {
          const url = match[1];
          if (url && (url.includes('.m3u8') || url.includes('.mp4') || url.includes('vidsrc'))) {
            if (!sources.find(s => s.src === url)) {
              sources.push({
                src: url,
                type: url.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
              });
            }
          }
        }
      });
    });

    // Remove duplicates
    const uniqueSources = sources.filter((source, index, self) =>
      index === self.findIndex(s => s.src === source.src)
    );

    const uniqueSubtitles = subtitles.filter((sub, index, self) =>
      index === self.findIndex(s => s.src === sub.src)
    );

    return {
      sources: uniqueSources,
      subtitles: uniqueSubtitles
    };
  } catch (error) {
    console.error('Error extracting video sources:', error.message);
    return {
      sources: [],
      subtitles: [],
      error: error.message
    };
  }
}

// API endpoint to get video sources
app.get('/api/video-source', async (req, res) => {
  try {
    const embedUrl = req.query.url;
    
    if (!embedUrl) {
      return res.status(400).json({ 
        error: 'Missing url parameter',
        sources: [],
        subtitles: []
      });
    }

    console.log(`Extracting sources from: ${embedUrl}`);
    
    const result = await extractVideoSources(embedUrl);
    
    if (result.sources.length === 0) {
      console.log('No sources found, returning embed URL as fallback');
      return res.json({
        embedUrl: embedUrl,
        sources: [],
        subtitles: result.subtitles || []
      });
    }

    res.json({
      embedUrl: embedUrl,
      sources: result.sources,
      subtitles: result.subtitles,
      extracted: true
    });
  } catch (error) {
    console.error('Error in /api/video-source:', error);
    res.status(500).json({
      error: error.message,
      sources: [],
      subtitles: []
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'video-source-proxy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Video source proxy server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/video-source`);
  console.log(`💡 Add to .env: REACT_APP_VIDEO_PROXY_URL=http://localhost:${PORT}/api/video-source`);
});

