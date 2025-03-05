import React from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <div className="hero">
        <header>
          <div className="logo" style={{ color: '#B2AC88', fontFamily: 'Sage, serif' }}>DeviMitra</div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </header>

        <div className="hero-content" style={{ marginTop: '80px' }}>
          <h1>Multilingual Real Estate Assistant</h1>
          <p>Breaking language barriers for better client relationships and faster deals.</p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
            <Link to="/usertypeselection">
              <button className="start-chat">
                Start Conversation
              </button>
            </Link>
            <Link to="/clientmanager">
              <button className="start-chat">
                Client Manager
              </button>
            </Link>
            <Link to="/property-analysis">
              <button className="start-chat">
                Property Analysis
              </button>
            </Link>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <div style={cardStyle}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🗣️</div>
              <h3 style={{ marginBottom: '10px', color: '#27ae60' }}>Multilingual Support</h3>
              <p>Hindi, English, Marathi, Telugu & more</p>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📝</div>
              <h3 style={{ marginBottom: '10px', color: '#27ae60' }}>Smart Summaries</h3>
              <p>Auto-extract client requirements</p>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏰</div>
              <h3 style={{ marginBottom: '10px', color: '#27ae60' }}>Follow-up Reminders</h3>
              <p>Never miss an opportunity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center'
};

export default HomePage;