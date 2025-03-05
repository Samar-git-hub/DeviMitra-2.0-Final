import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/App.css";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [waitTime, setWaitTime] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [agentStatus, setAgentStatus] = useState("searching");
  
  // Languages supported
  const languages = ["English", "Hindi", "Marathi", "Telugu", "Tamil", "Kannada", "Bengali"];
  
  useEffect(() => {
    let interval;
    if (isFormSubmitted) {
      interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
        
        // Simulate finding an agent after 10 seconds
        if (waitTime >= 9) {
          setAgentStatus("found");
          clearInterval(interval);
          
          // Redirect to chat after 2 more seconds
          setTimeout(() => {
            navigate("/live-chat", { 
              state: { 
                isClient: true, 
                preferredLanguage: preferredLanguage,
                agentName: "Rahul Sharma",
                agentLanguages: ["Hindi", "English", "Marathi"] 
              }
            });
          }, 2000);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isFormSubmitted, waitTime, preferredLanguage, navigate]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (preferredLanguage) {
      setIsFormSubmitted(true);
    }
  };

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

      <div style={styles.content}>
        {!isFormSubmitted ? (
          <>
            <h1 style={styles.title}>Before We Connect You</h1>
            <p style={styles.subtitle}>Please select your preferred language for communication</p>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Language:</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="">Select a language</option>
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              
              <button type="submit" style={styles.submitButton}>
                Find an Agent
              </button>
            </form>
          </>
        ) : (
          <div style={styles.waitingContainer}>
            <h1 style={styles.title}>
              {agentStatus === "searching" ? "Looking for an Available Agent" : "Agent Found!"}
            </h1>
            
            {agentStatus === "searching" ? (
              <>
                <div style={styles.loadingAnimation}>
                  <div style={styles.dot}></div>
                  <div style={styles.dot}></div>
                  <div style={styles.dot}></div>
                </div>
                
                <p style={styles.waitingText}>
                  We're looking for an agent who speaks {preferredLanguage}
                </p>
                
                <div style={styles.waitTimeContainer}>
                  <p style={styles.waitTimeText}>Wait time: {waitTime} seconds</p>
                  <p style={styles.estimateText}>Estimated total wait: ~30 seconds</p>
                </div>
                
                <button 
                  onClick={() => setIsFormSubmitted(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </>
            ) : (
              <div style={styles.agentFoundContainer}>
                <div style={styles.agentAvatar}>👨🏽‍💼</div>
                <p style={styles.agentName}>Rahul Sharma</p>
                <p style={styles.agentInfo}>
                  Speaks: Hindi, English, Marathi
                </p>
                <p style={styles.connectingText}>
                  Connecting you now...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    minHeight: "100vh",
    background: "rgba(255, 255, 255, 0.8)",
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
    maxWidth: "600px",
    margin: "0 auto",
    padding: "140px 20px 40px",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5em",
    color: "#B2AC88",
    marginBottom: "15px",
    fontFamily: "Sage, serif",
  },
  subtitle: {
    fontSize: "1.2em",
    color: "#555",
    marginBottom: "40px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "25px",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "1.1em",
    color: "#2c3e50",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  select: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "1.1em",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#B2AC88",
    color: "white",
    padding: "14px 30px",
    borderRadius: "30px",
    border: "none",
    fontSize: "1.1em",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontWeight: "bold",
  },
  waitingContainer: {
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  loadingAnimation: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    margin: "30px 0",
  },
  dot: {
    width: "20px",
    height: "20px",
    backgroundColor: "#B2AC88",
    borderRadius: "50%",
    animation: "bounce 1.4s infinite ease-in-out both",
    animationDelay: (index) => `${index * 0.16}s`,
  },
  waitingText: {
    fontSize: "1.2em",
    color: "#2c3e50",
    marginBottom: "25px",
  },
  waitTimeContainer: {
    margin: "30px 0",
  },
  waitTimeText: {
    fontSize: "1.3em",
    color: "#2c3e50",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  estimateText: {
    fontSize: "0.9em",
    color: "#777",
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
    color: "#555",
    padding: "12px 25px",
    borderRadius: "30px",
    border: "none",
    fontSize: "1em",
    cursor: "pointer",
    marginTop: "20px",
  },
  agentFoundContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "fadeIn 0.5s ease-in",
  },
  agentAvatar: {
    fontSize: "5em",
    margin: "10px 0 20px",
  },
  agentName: {
    fontSize: "1.6em",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "5px",
  },
  agentInfo: {
    fontSize: "1.1em",
    color: "#555",
    marginBottom: "25px",
  },
  connectingText: {
    fontSize: "1.2em",
    color: "#B2AC88",
    fontWeight: "bold",
    marginTop: "20px",
  },
  "@keyframes bounce": {
    "0%, 80%, 100%": {
      transform: "scale(0)",
    },
    "40%": {
      transform: "scale(1)",
    }
  },
  "@keyframes fadeIn": {
    "from": { opacity: 0 },
    "to": { opacity: 1 }
  }
};

export default WaitingRoom;