# FilmHub - Movie Discovery App

A modern, responsive movie discovery application built with React. Browse popular movies, search for your favorites, and explore detailed information about films.

## Features

- 🎬 **Browse Movies**: Discover popular, top-rated, trending, and now-playing movies
- 🔍 **Search Functionality**: Search for movies by title, actor, or genre
- 🎥 **Stream Movies**: Watch movies directly in the app with multiple streaming providers
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎨 **Modern UI**: Dark theme with smooth animations and transitions
- 📺 **Movie Details**: View comprehensive information including cast, trailers, and ratings
- 🎯 **Genre Filters**: Filter movies by genre, year, rating, and more
- ⚡ **Fast Performance**: Optimized for quick loading and smooth navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MovieApp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your TMDB API key to the `.env` file:
```
REACT_APP_TMDB_API_KEY=your_api_key_here
```

5. Set up the backend server (for video source extraction):
```bash
cd server
npm install
npm start
```

6. Add backend proxy URL to frontend `.env` file:
```
REACT_APP_VIDEO_PROXY_URL=http://localhost:3001/api/video-source
```

7. (Optional) For testing video controls without backend, add demo mode to `.env`:
```
REACT_APP_USE_DEMO_VIDEO=true
```

8. Start the development servers:

**Option 1: Start both servers together (Recommended):**
```bash
npm run dev
```

**Option 2: Start separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)
The backend API will run at [http://localhost:3001](http://localhost:3001)

See `SETUP_BACKEND.md` for detailed backend setup instructions.

## Getting a TMDB API Key

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account
3. Navigate to Settings > API
4. Request an API key
5. Copy your API key and add it to your `.env` file

## Project Structure

```
MovieApp/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Footer.js
│   │   ├── Footer.css
│   │   ├── MovieCard.js
│   │   ├── MovieCard.css
│   │   ├── VideoPlayer.js
│   │   ├── VideoPlayer.css
│   │   ├── FeaturedSlider.js
│   │   └── FeaturedSlider.css
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── MovieDetail.js
│   │   ├── MovieDetail.css
│   │   ├── Search.js
│   │   └── Search.css
│   ├── services/
│   │   ├── api.js
│   │   └── streaming.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Technologies Used

- **React** - UI library
- **React Router** - Routing
- **TMDB API** - Movie data
- **CSS3** - Styling with modern features

## Features in Detail

### Home Page
- Hero section with welcome message
- Trending movies
- Now playing movies
- Popular movies
- Top-rated movies

### Movie Detail Page
- Full movie information
- Cast and crew
- **Stream movies** with multiple provider options (VidSrc, VidSrc Pro, EmbedSU, etc.)
- Movie trailer (if available)
- Ratings and reviews
- Genre tags

### Search/Discover Page
- Real-time movie search
- **Advanced filters**: Genre, year, rating, and sort options
- Pagination support
- Load more functionality
- Search history via URL parameters

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Streaming Feature

The app includes embedded movie streaming functionality with multiple provider options:
- **VidSrc** - Primary streaming provider
- **VidSrc Pro** - Alternative streaming source
- **EmbedSU** - Additional streaming option
- **VidSrc.to** - Backup streaming provider

Users can switch between different streaming sources directly from the movie detail page. The streaming feature is implemented similar to [streamium](https://github.com/gmonarque/streamium).

**⚠️ Legal Disclaimer**: The streaming feature is provided for educational purposes only. Please ensure you have the legal right to stream content in your jurisdiction. Users are responsible for compliance with local copyright laws.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the API
- [Streamium](https://github.com/gmonarque/streamium) for streaming implementation inspiration
- Inspired by modern streaming platforms

