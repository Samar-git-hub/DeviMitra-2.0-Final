import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
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
        <h1 style={{ fontFamily: "Sage, serif" }}>Contact Us</h1>

        <div className="contact-box">
          <div className="contact-info">
            <p>📧 hello@proptalk.ai</p>
            <p>📍 Mumbai, India</p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="contact-input"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="contact-input"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="contact-input"
              rows="5"
            />
            <button type="submit" className="start-chat">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add these styles to your CSS file or use inline styles
const styles = {
  '.contact-box': {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
    marginTop: '20px'
  },
  '.contact-info': {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#2c3e50'
  },
  '.contact-form': {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  '.contact-input': {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em'
  },
  'textarea.contact-input': {
    resize: 'vertical',
    minHeight: '100px'
  },
  '@media (max-width: 768px)': {
    '.contact-box': {
      margin: '20px',
      padding: '20px'
    }
  }
};

export default Contact;