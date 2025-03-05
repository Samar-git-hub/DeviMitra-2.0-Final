import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

const About = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>PropTalk</div>
        <nav>
          <ul style={styles.navList}>
            <li><Link to="/" style={styles.navLink}>Home</Link></li>
            <li><Link to="/features" style={styles.navLink}>Features</Link></li>
            <li><Link to="/contact" style={styles.navLink}>Contact</Link></li>
            <li><Link to="/about" style={styles.navLink}>About</Link></li>
          </ul>
        </nav>
      </header>

      <div style={{...styles.content, paddingTop: '80px'}}>
        <h1 style={styles.mainHeading}>About PropTalk</h1>
        
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Our Mission</h2>
          <p style={styles.paragraph}>
            PropTalk is dedicated to breaking down language barriers in India's diverse real estate market. 
            We empower real estate professionals to communicate effectively with clients regardless of language 
            differences, ensuring that every conversation leads to better understanding, stronger relationships, 
            and successful property transactions.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>The Language Challenge in Indian Real Estate</h2>
          <p style={styles.paragraph}>
            In India's vibrant property market, language diversity presents unique challenges. Agents often interact 
            with clients who speak Hindi, Marathi, Telugu, English, and sometimes a mix of languages. Critical details 
            about buyer preferences, budgets, and requirements can get lost in translation or go unrecorded, leading 
            to missed opportunities and frustrated clients.
          </p>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>22+</div>
            <div style={styles.statLabel}>Official Languages</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>60%</div>
            <div style={styles.statLabel}>Conversations in Multiple Languages</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>40%</div>
            <div style={styles.statLabel}>Information Lost in Translation</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>85%</div>
            <div style={styles.statLabel}>Faster Deals with Clear Communication</div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Our Solution</h2>
          <p style={styles.paragraph}>
            PropTalk's multilingual assistant provides real-time translation, conversation recording, key information extraction, 
            and follow-up management—all in one convenient platform. Our technology helps real estate professionals:
          </p>
          <ul style={styles.list}>
            <li>Communicate fluently with clients in their preferred language</li>
            <li>Automatically capture and organize client requirements from conversations</li>
            <li>Never miss follow-up opportunities with intelligent reminders</li>
            <li>Access complete conversation histories with translations</li>
            <li>Analyze properties and present information in multiple languages</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Our Technology</h2>
          <p style={styles.paragraph}>
            PropTalk leverages advanced AI language models, voice recognition, and natural language processing to deliver 
            a seamless multilingual experience. Our platform continuously improves as it learns from real estate-specific 
            conversations, becoming more efficient at identifying property requirements, extracting key information, and 
            facilitating smooth communication across language barriers.
          </p>
        </div>

        <div style={styles.teamSection}>
          <h2 style={styles.sectionHeading}>Our Team</h2>
          <p style={styles.paragraph}>
            PropTalk was created by a diverse team of technology experts and real estate professionals who experienced 
            the language challenges in India's property market firsthand. Our team combines expertise in artificial intelligence, 
            linguistics, and real estate operations to create a solution that truly addresses the practical needs of agents 
            working in multilingual environments.
          </p>
          <div style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} style={styles.teamMember}>
                <div style={styles.memberAvatar}>{member.avatar}</div>
                <h3 style={styles.memberName}>{member.name}</h3>
                <p style={styles.memberRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.ctaContainer}>
          <Link to="/contact" style={{textDecoration: 'none'}}>
            <button style={styles.ctaButton}>
              Contact Our Team
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const teamMembers = [
  {
    avatar: "👨🏽‍💼",
    name: "Rajesh Sharma",
    role: "Co-founder & Real Estate Expert"
  },
  {
    avatar: "👩🏻‍💻",
    name: "Priya Narayan",
    role: "AI & NLP Specialist"
  },
  {
    avatar: "👨🏾‍💻",
    name: "Vikram Desai",
    role: "Technology Lead"
  },
  {
    avatar: "👩🏽‍🔧",
    name: "Ananya Reddy",
    role: "Linguistics & Translation Expert"
  }
];

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    minHeight: '100vh',
    background: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 5%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  logo: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#B2AC88',
    fontFamily: 'Sage, serif',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    marginLeft: '20px',
    color: '#2c3e50',
    textDecoration: 'none',
    fontSize: '1.1em',
    transition: 'color 0.3s ease',
  },
  content: {
    maxWidth: '900px',
    textAlign: 'left',
    width: '100%',
    margin: '0 auto',
    paddingTop: '100px',
  },
  mainHeading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#B2AC88',
    fontSize: '2.8em',
    fontFamily: "Sage, serif",
  },
  section: {
    marginBottom: '40px',
  },
  sectionHeading: {
    color: '#B2AC88',
    marginBottom: '15px',
    fontSize: '1.8em',
    fontFamily: "Sage, serif",
  },
  paragraph: {
    color: '#34495e',
    lineHeight: '1.8',
    fontSize: '1.1em',
    marginBottom: '15px',
  },
  list: {
    color: '#34495e',
    lineHeight: '1.8',
    fontSize: '1.1em',
    paddingLeft: '20px',
    marginTop: '15px',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    margin: '40px 0',
    textAlign: 'center',
  },
  statItem: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  statNumber: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: '#B2AC88',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '0.9em',
    color: '#555',
  },
  teamSection: {
    marginTop: '50px',
    marginBottom: '40px',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    margin: '30px 0',
  },
  teamMember: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  memberAvatar: {
    fontSize: '3em',
    marginBottom: '15px',
  },
  memberName: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  memberRole: {
    fontSize: '0.9em',
    color: '#555',
  },
  ctaContainer: {
    textAlign: 'center',
    marginTop: '40px',
  },
  ctaButton: {
    background: '#B2AC88',
    color: 'white',
    padding: '15px 35px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(178, 172, 136, 0.3)',
  },
};

export default About;