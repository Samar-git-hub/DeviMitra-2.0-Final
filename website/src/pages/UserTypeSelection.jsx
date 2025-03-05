import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import Navbar from "../components/Navbar";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  
  // Languages supported
  const languages = ["English", "Hindi", "Marathi", "Telugu", "Tamil", "Kannada", "Bengali"];
  
  const handleContinue = () => {
    if (!userType) {
      alert("Please select if you're a client or an agent");
      return;
    }
    
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    
    if (userType === "client") {
      // Navigate to waiting room as a client
      navigate("/waiting-room", { 
        state: { 
          clientName: name,
          preferredLanguage: preferredLanguage
        } 
      });
    } else {
      // Navigate to agent dashboard
      navigate("/agent-dashboard", { 
        state: { 
          agentName: name,
          preferredLanguages: [preferredLanguage]
        } 
      });
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        <div style={styles.selectionCard}>
          <h1 style={styles.title}>Welcome to PropTalk</h1>
          <p style={styles.subtitle}>Choose how you want to continue</p>
          
          <div style={styles.optionsContainer}>
            <div 
              style={{
                ...styles.optionCard,
                borderColor: userType === "client" ? "#B2AC88" : "#ddd"
              }}
              onClick={() => setUserType("client")}
            >
              <div style={styles.optionIcon}>👨‍💼</div>
              <div style={styles.optionLabel}>I am a Client</div>
              <div style={styles.optionDescription}>
                Looking for property assistance
              </div>
            </div>
            
            <div 
              style={{
                ...styles.optionCard,
                borderColor: userType === "agent" ? "#B2AC88" : "#ddd"
              }}
              onClick={() => setUserType("agent")}
            >
              <div style={styles.optionIcon}>🏢</div>
              <div style={styles.optionLabel}>I am an Agent</div>
              <div style={styles.optionDescription}>
                Providing property assistance
              </div>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Preferred Language:</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              style={styles.select}
            >
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          
          <button 
            style={styles.continueButton}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/hpbg.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
  },
  content: {
    width: "100%",
    maxWidth: "800px",
    padding: "20px",
    marginTop: "60px"
  },
  selectionCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    padding: "30px",
    textAlign: "center",
    animation: "fadeIn 0.5s ease-in-out"
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
    marginBottom: "30px",
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  optionCard: {
    width: "240px",
    padding: "20px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  optionIcon: {
    fontSize: "3em",
    marginBottom: "15px"
  },
  optionLabel: {
    fontSize: "1.3em",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px"
  },
  optionDescription: {
    fontSize: "0.9em",
    color: "#666"
  },
  formGroup: {
    marginBottom: "20px",
    textAlign: "left"
  },
  label: {
    display: "block",
    fontSize: "1.1em",
    color: "#333",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "1em",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none"
  },
  select: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "1em",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff"
  },
  continueButton: {
    backgroundColor: "#B2AC88",
    color: "white",
    padding: "14px 30px",
    borderRadius: "30px",
    border: "none",
    fontSize: "1.1em",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
    boxShadow: "0 4px 10px rgba(178, 172, 136, 0.3)",
    transition: "transform 0.3s, background-color 0.3s"
  },
  "@keyframes fadeIn": {
    "from": { opacity: 0, transform: "translateY(20px)" },
    "to": { opacity: 1, transform: "translateY(0)" }
  }
};

export default UserTypeSelection;