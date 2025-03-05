import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

const Features = () => {
  return (
    <div>
      <div className="hero">
        <header>
          <div className="logo" style={{ color: '#B2AC88', fontFamily: 'Sage, serif' }}>PropTalk</div>
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
          <h1 style={{ fontFamily: "Sage, serif" }}>Powerful Multilingual Real Estate Assistant</h1>
          <p style={styles.description}>
            PropTalk breaks language barriers in real estate, helping agents communicate with clients in multiple Indian languages, 
            capture key requirements, and never miss a follow-up opportunity.
          </p>

          <div style={styles.featureGrid}>
            {features.map((feature, index) => (
              <div key={index} style={styles.featureItem}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h2 style={styles.featureTitle}>{feature.title}</h2>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>

          <div style={styles.languageSection}>
            <h2 style={styles.sectionTitle}>Languages Supported</h2>
            <div style={styles.languageGrid}>
              {languages.map((language, index) => (
                <div key={index} style={styles.languageItem}>
                  <div style={styles.languageFlag}>{language.flag}</div>
                  <h3 style={styles.languageName}>{language.name}</h3>
                  <p style={styles.languageExample}>{language.example}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.useCasesSection}>
            <h2 style={styles.sectionTitle}>Real Estate Use Cases</h2>
            <div style={styles.useCaseGrid}>
              {useCases.map((useCase, index) => (
                <div key={index} style={styles.useCaseItem}>
                  <div style={styles.useCaseIcon}>{useCase.icon}</div>
                  <h3 style={styles.useCaseTitle}>{useCase.title}</h3>
                  <p style={styles.useCaseDescription}>{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.ctaSection}>
            <h2 style={styles.ctaTitle}>Ready to Transform Your Property Conversations?</h2>
            <p style={styles.ctaDescription}>
              Start using PropTalk today and never let language barriers get in the way of closing a deal.
            </p>
            <Link to="/chatwindow">
              <button className="start-chat">
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  { 
    icon: "🗣️", 
    title: "Real-time Translation", 
    description: "Communicate with clients in Hindi, Marathi, Telugu, English and more with instant translations in both directions." 
  },
  { 
    icon: "🎯", 
    title: "Requirement Extraction", 
    description: "Automatically identifies and catalogs client requirements, preferences, budget constraints, and location interests." 
  },
  { 
    icon: "📝", 
    title: "Smart Transcripts", 
    description: "Record all client conversations with automatic language detection and translations for future reference." 
  },
  { 
    icon: "⏰", 
    title: "Follow-up Management", 
    description: "Never miss an opportunity with intelligent follow-up detection and reminder scheduling." 
  },
  { 
    icon: "👥", 
    title: "Client Management", 
    description: "Organize client information, preferences, and communication history in one centralized platform." 
  },
  { 
    icon: "📊", 
    title: "Property Analysis", 
    description: "Get AI-powered property analysis with translated outputs to better serve clients in their preferred language." 
  },
];

const languages = [
  {
    flag: "🇮🇳",
    name: "Hindi",
    example: "मुझे 3 बेडरूम का अपार्टमेंट चाहिए।"
  },
  {
    flag: "🇮🇳",
    name: "Marathi",
    example: "मला लोखंडवाला मध्ये 2BHK फ्लॅट हवा आहे।"
  },
  {
    flag: "🇮🇳",
    name: "Telugu",
    example: "నాకు హైదరాబాద్ లో 3BHK అపార్ట్మెంట్ కావాలి।"
  },
  {
    flag: "🇬🇧",
    name: "English",
    example: "I'm looking for a villa in Koramangala."
  },
  {
    flag: "🔄",
    name: "Mixed",
    example: "I need a 2BHK flat जो मेट्रो स्टेशन के पास हो।"
  }
];

const useCases = [
  {
    icon: "🏢",
    title: "In-person Client Meetings",
    description: "Overcome language barriers during property visits and client meetings with real-time translation."
  },
  {
    icon: "📱",
    title: "Phone Conversations",
    description: "Record and transcribe phone calls with clients, capturing all important details in any language."
  },
  {
    icon: "📧",
    title: "Email & Message Responses",
    description: "Generate professional responses in the client's preferred language with accurate property information."
  },
  {
    icon: "🤝",
    title: "Negotiation Support",
    description: "Get cultural context and language support during critical negotiation phases."
  }
];

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
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "30px",
    marginBottom: "60px",
    maxWidth: "1200px",
    margin: "0 auto 60px",
  },
  featureItem: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "default",
  },
  featureIcon: {
    fontSize: "2.5em",
    marginBottom: "15px",
    textAlign: "center",
  },
  featureTitle: {
    fontSize: "1.4em",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#B2AC88",
    textAlign: "center",
  },
  featureDescription: {
    fontSize: "1em",
    color: "#555",
    lineHeight: "1.5",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "2em",
    color: "#B2AC88",
    textAlign: "center",
    marginBottom: "30px",
    fontFamily: "Sage, serif"
  },
  languageSection: {
    marginBottom: "60px",
    maxWidth: "1200px",
    margin: "0 auto 60px",
  },
  languageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  languageItem: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  languageFlag: {
    fontSize: "2em",
    marginBottom: "10px",
  },
  languageName: {
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  languageExample: {
    fontSize: "0.9em",
    color: "#555",
    fontStyle: "italic",
  },
  useCasesSection: {
    marginBottom: "60px",
    maxWidth: "1200px",
    margin: "0 auto 60px",
  },
  useCaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
  },
  useCaseItem: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  useCaseIcon: {
    fontSize: "2em",
    marginBottom: "15px",
  },
  useCaseTitle: {
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "#B2AC88",
    marginBottom: "10px",
  },
  useCaseDescription: {
    fontSize: "0.9em",
    color: "#555",
    lineHeight: "1.5",
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
    fontFamily: "Sage, serif"
  },
  ctaDescription: {
    fontSize: "1.1em",
    color: "#555",
    marginBottom: "25px",
    maxWidth: "600px",
    margin: "0 auto 25px",
  },
};

export default Features;