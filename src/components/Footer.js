import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-icon">🎬</span>
              FilmHub
            </h3>
            <p className="footer-description">
              Your ultimate destination for discovering and exploring the world of cinema.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/search">Discover</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">About</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FilmHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


