import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

const Features = () => {
  return (
    <div>
      <div className="hero">
        <header>
          <div
            className="logo"
            style={{ color: "#B2AC88", fontFamily: "Sage, serif" }}
          >
            DeviMitra
          </div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </header>

        <div className="hero-content" style={{ marginTop: "200px" }}>
          <h1 style={{ fontFamily: "Sage, serif" }}>
            Powerful Multilingual Real Estate Assistant
          </h1>
          <p style={styles.description}>
            PropTalk breaks language barriers in real estate, helping agents
            communicate with clients in multiple Indian languages, capture key
            requirements, and never miss a follow-up opportunity.
          </p>

          <div style={styles.ctaSection}>
            <h2 style={styles.ctaTitle}>
              Ready to Transform Your Property Conversations?
            </h2>
            <p style={styles.ctaDescription}>
              Start using PropTalk today and never let language barriers get in the way of closing a deal.
            </p>
            <Link to="/chatwindow">
              <button className="start-chat">Start Free Trial</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  description: {
    fontSize: "1.2em",
    marginBottom: "40px",
    color: "#34495e",
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto 40px",
    lineHeight: "1.6",
  },
  ctaSection: {
    background: "#f9f9f9",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "1.8em",
    color: "#B2AC88",
    marginBottom: "15px",
    fontFamily: "Sage, serif",
  },
  ctaDescription: {
    fontSize: "1.1em",
    color: "#555",
    marginBottom: "25px",
    maxWidth: "600px",
    margin: "0 auto 25px",
  },
};

export default Features;