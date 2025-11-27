import React from 'react';
import { isApiKeyConfigured } from '../services/api';
import './ApiKeyWarning.css';

const ApiKeyWarning = () => {
  if (isApiKeyConfigured()) return null;

  return (
    <div className="api-key-warning">
      <div className="warning-content">
        <h3>⚠️ API Key Required</h3>
        <p>
          To view movies, please add your TMDB API key to the <code>.env</code> file.
        </p>
        <ol>
          <li>Get a free API key from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer">TMDB</a></li>
          <li>Create a <code>.env</code> file in the root directory</li>
          <li>Add: <code>REACT_APP_TMDB_API_KEY=your_api_key_here</code></li>
          <li>Restart the development server</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiKeyWarning;

