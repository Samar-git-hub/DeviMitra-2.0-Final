import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  // Determine which link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="navbar">
      <div className="logo">DeviMitra</div>
      <nav>
        <ul className="nav-list">
          <li><Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link></li>
          <li><Link to="/features" className={`nav-link ${isActive('/features')}`}>Features</Link></li>
          <li><Link to="/clientmanager" className={`nav-link ${isActive('/clientmanager')}`}>Clients</Link></li>
          <li><Link to="/property-analysis" className={`nav-link ${isActive('/property-analysis')}`}>Analysis</Link></li>
          <li><Link to="/transcript-viewer" className={`nav-link ${isActive('/transcript-viewer')}`}>Transcripts</Link></li>
          <li><Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link></li>
          <li><Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;