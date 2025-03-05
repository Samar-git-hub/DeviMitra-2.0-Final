import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/App.css";
import Navbar from "../components/Navbar";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [agentStatus, setAgentStatus] = useState("offline");
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [waitingClients, setWaitingClients] = useState([]);
  const [showClientRequest, setShowClientRequest] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  
  // Languages the agent can speak
  const languageOptions = ["English", "Hindi", "Marathi", "Telugu", "Tamil", "Kannada", "Bengali"];
  
  // Handle language selection toggle
  const toggleLanguage = (language) => {
    if (availableLanguages.includes(language)) {
      setAvailableLanguages(prev => prev.filter(lang => lang !== language));
    } else {
      setAvailableLanguages(prev => [...prev, language]);
    }
  };
  
  // Handle agent status change
  const toggleAgentStatus = () => {
    if (agentStatus === "offline") {
      if (availableLanguages.length === 0) {
        alert("Please select at least one language you can assist with.");
        return;
      }
      setAgentStatus("online");
    } else {
      setAgentStatus("offline");
    }
  };
  
  // Simulate receiving a client request after going online
  useEffect(() => {
    let clientTimer;
    
    if (agentStatus === "online") {
      // Add some mock waiting clients
      setWaitingClients([
        { id: 1, name: "Samar Kamat", language: "Hindi", waitTime: "2:30" },
        { id: 2, name: "Shlok Doshi", language: "English", waitTime: "1:15" },
        { id: 3, name: "Kartika Dhonde", language: "Marathi", waitTime: "0:45" }
      ]);
      
      // Show a client request after 5 seconds
      clientTimer = setTimeout(() => {
        setCurrentClient({
          id: 4,
          name: "Neha Desai",
          language: "Hindi",
          location: "Mumbai",
          propertyInterest: "2BHK Apartment",
          budget: "₹75-90 Lakhs"
        });
        setShowClientRequest(true);
      }, 5000);
    } else {
      setWaitingClients([]);
      setShowClientRequest(false);
      setCurrentClient(null);
    }
    
    return () => clearTimeout(clientTimer);
  }, [agentStatus]);
  
  // Handle accepting a client
  const acceptClient = () => {
    navigate("/live-chat", { 
      state: { 
        isClient: false, 
        isAgent: true,
        agentLanguages: availableLanguages,
        clientName: currentClient.name,
        clientLanguage: currentClient.language
      }
    });
  };
  
  // Handle declining a client
  const declineClient = () => {
    setShowClientRequest(false);
    setCurrentClient(null);
  };

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.content}>
        <div style={styles.dashboardHeader}>
          <h1 style={styles.title}>Agent Dashboard</h1>
          <div style={styles.statusToggle}>
            <span style={styles.statusLabel}>Status:</span>
            <button 
              onClick={toggleAgentStatus}
              style={{
                ...styles.statusButton,
                backgroundColor: agentStatus === "online" ? "#27ae60" : "#e74c3c"
              }}
            >
              {agentStatus === "online" ? "Online" : "Offline"}
            </button>
          </div>
        </div>
        
        <div style={styles.dashboardGrid}>
          <div style={styles.leftPanel}>
            <div style={styles.languageSection}>
              <h2 style={styles.sectionTitle}>Languages You Speak</h2>
              <p style={styles.sectionDescription}>
                Select the languages you can assist clients with:
              </p>
              
              <div style={styles.languagesGrid}>
                {languageOptions.map(language => (
                  <div 
                    key={language}
                    onClick={() => agentStatus === "offline" && toggleLanguage(language)}
                    style={{
                      ...styles.languageChip,
                      backgroundColor: availableLanguages.includes(language) ? "#B2AC88" : "#f1f1f1",
                      color: availableLanguages.includes(language) ? "white" : "#555",
                      cursor: agentStatus === "offline" ? "pointer" : "not-allowed",
                      opacity: agentStatus === "offline" ? 1 : 0.8
                    }}
                  >
                    {language}
                  </div>
                ))}
              </div>
              
              {agentStatus === "online" && (
                <p style={styles.languageNote}>
                  You cannot change languages while online
                </p>
              )}
            </div>
            
            <div style={styles.clientsSection}>
              <h2 style={styles.sectionTitle}>Waiting Clients</h2>
              
              {agentStatus === "offline" ? (
                <p style={styles.offlineMessage}>
                  Go online to see waiting clients
                </p>
              ) : waitingClients.length > 0 ? (
                <div style={styles.clientsList}>
                  {waitingClients.map(client => (
                    <div key={client.id} style={styles.clientCard}>
                      <div style={styles.clientInfo}>
                        <p style={styles.clientName}>{client.name}</p>
                        <p style={styles.clientLanguage}>
                          Preferred: <span style={styles.languageHighlight}>{client.language}</span>
                        </p>
                      </div>
                      <div style={styles.waitInfo}>
                        <p style={styles.waitTime}>Waiting: {client.waitTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.noClientsMessage}>
                  No clients waiting at the moment
                </p>
              )}
            </div>
          </div>
          
          <div style={styles.rightPanel}>
            <div style={styles.activitySection}>
              <h2 style={styles.sectionTitle}>Agent Activity</h2>
              
              {agentStatus === "online" ? (
                <div style={styles.statusCard}>
                  <div style={styles.statusIndicator}></div>
                  <div style={styles.statusInfo}>
                    <p style={styles.statusMessage}>You are online and available for clients</p>
                    <p style={styles.statusDetails}>
                      Supporting: {availableLanguages.join(", ")}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={styles.statusCard}>
                  <div style={{...styles.statusIndicator, backgroundColor: "#e74c3c"}}></div>
                  <div style={styles.statusInfo}>
                    <p style={styles.statusMessage}>You are currently offline</p>
                    <p style={styles.statusDetails}>
                      Go online to start receiving client requests
                    </p>
                  </div>
                </div>
              )}
              
              <div style={styles.activityStats}>
                <div style={styles.statCard}>
                  <p style={styles.statValue}>23</p>
                  <p style={styles.statLabel}>Clients Today</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statValue}>4.8</p>
                  <p style={styles.statLabel}>Average Rating</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statValue}>12</p>
                  <p style={styles.statLabel}>Properties Shown</p>
                </div>
              </div>
            </div>
            
            <div style={styles.recentActivity}>
              <h2 style={styles.sectionTitle}>Recent Activity</h2>
              
              <div style={styles.timeline}>
                <div style={styles.timelineItem}>
                  <div style={styles.timelineDot}></div>
                  <div style={styles.timelineContent}>
                    <p style={styles.timelineTime}>10:30 AM</p>
                    <p style={styles.timelineText}>Chat with Ravi Patel about 3BHK in Andheri</p>
                  </div>
                </div>
                <div style={styles.timelineItem}>
                  <div style={styles.timelineDot}></div>
                  <div style={styles.timelineContent}>
                    <p style={styles.timelineTime}>9:15 AM</p>
                    <p style={styles.timelineText}>Property analysis for client in Powai</p>
                  </div>
                </div>
                <div style={styles.timelineItem}>
                  <div style={styles.timelineDot}></div>
                  <div style={styles.timelineContent}>
                    <p style={styles.timelineTime}>Yesterday</p>
                    <p style={styles.timelineText}>Added 3 new properties to database</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client Request Popup */}
      {showClientRequest && (
        <div style={styles.overlay}>
          <div style={styles.clientRequestCard}>
            <h2 style={styles.requestTitle}>Incoming Client Request</h2>
            
            <div style={styles.clientDetails}>
              <p style={styles.clientDetailItem}>
                <span style={styles.detailLabel}>Name:</span> {currentClient.name}
              </p>
              <p style={styles.clientDetailItem}>
                <span style={styles.detailLabel}>Language:</span> {currentClient.language}
              </p>
              <p style={styles.clientDetailItem}>
                <span style={styles.detailLabel}>Location:</span> {currentClient.location}
              </p>
              <p style={styles.clientDetailItem}>
                <span style={styles.detailLabel}>Looking for:</span> {currentClient.propertyInterest}
              </p>
              <p style={styles.clientDetailItem}>
                <span style={styles.detailLabel}>Budget:</span> {currentClient.budget}
              </p>
            </div>
            
            <div style={styles.requestActions}>
              <button 
                onClick={acceptClient}
                style={styles.acceptButton}
              >
                Accept
              </button>
              <button 
                onClick={declineClient}
                style={styles.declineButton}
              >
                Decline
              </button>
            </div>
            
            <p style={styles.autoAcceptMessage}>
              Auto-accepting in 15 seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    minHeight: "100vh",
    background: "rgba(255, 255, 255, 0.8)",
    fontFamily: "'Poppins', sans-serif",
    backgroundImage: "url('/hpbg.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "120px 20px 40px",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2.5em",
    color: "#B2AC88",
    margin: 0,
    fontFamily: "Sage, serif",
  },
  statusToggle: {
    display: "flex",
    alignItems: "center",
  },
  statusLabel: {
    marginRight: "10px",
    fontSize: "1.1em",
    color: "#2c3e50",
  },
  statusButton: {
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    color: "white",
    fontSize: "1em",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "30px",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  languageSection: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    animation: "fadeIn 0.5s ease-in-out",
  },
  sectionTitle: {
    fontSize: "1.5em",
    color: "#B2AC88",
    marginTop: 0,
    marginBottom: "15px",
    fontFamily: "Sage, serif",
  },
  sectionDescription: {
    fontSize: "1em",
    color: "#555",
    marginBottom: "20px",
  },
  languagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "10px",
    marginBottom: "15px",
  },
  languageChip: {
    padding: "10px 15px",
    borderRadius: "20px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "0.9em",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  languageNote: {
    fontSize: "0.9em",
    color: "#e74c3c",
    fontStyle: "italic",
    marginTop: "10px",
  },
  clientsSection: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    animation: "fadeIn 0.7s ease-in-out",
  },
  offlineMessage: {
    color: "#777",
    textAlign: "center",
    padding: "30px 0",
    fontStyle: "italic",
  },
  clientsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  clientCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #eee",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  clientCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #eee",
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  clientCard: {
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    }
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: "1.1em",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0 0 5px 0",
  },
  clientLanguage: {
    fontSize: "0.9em",
    color: "#555",
    margin: 0,
  },
  languageHighlight: {
    fontWeight: "bold",
    color: "#B2AC88",
  },
  waitInfo: {
    textAlign: "right",
  },
  waitTime: {
    fontSize: "0.9em",
    fontWeight: "bold",
    color: "#e67e22",
    margin: 0,
  },
  noClientsMessage: {
    color: "#777",
    textAlign: "center",
    padding: "30px 0",
  },
  activitySection: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    animation: "fadeIn 0.9s ease-in-out",
  },
  statusCard: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #eee",
  },
  statusIndicator: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    backgroundColor: "#27ae60",
    marginRight: "15px",
    boxShadow: "0 0 10px rgba(39, 174, 96, 0.5)",
  },
  statusInfo: {
    flex: 1,
  },
  statusMessage: {
    fontSize: "1.1em",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0 0 5px 0",
  },
  statusDetails: {
    fontSize: "0.9em",
    color: "#555",
    margin: 0,
  },
  activityStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "20px",
  },
  statCard: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid #eee",
    transition: "transform 0.3s ease",
    ":hover": {
        transform: "translateY(-3px)",
    }
  },

  statValue: {
    fontSize: "1.8em",
    fontWeight: "bold",
    color: "#B2AC88",
    margin: "0 0 5px 0",
  },
  statLabel: {
    fontSize: "0.9em",
    color: "#555",
    margin: 0,
  },
  recentActivity: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    animation: "fadeIn 1.1s ease-in-out",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  timelineItem: {
    display: "flex",
    alignItems: "flex-start",
  },
  timelineDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#B2AC88",
    marginTop: "5px",
    marginRight: "15px",
  },
  timelineContent: {
    flex: 1,
  },
  timelineTime: {
    fontSize: "0.9em",
    fontWeight: "bold",
    color: "#B2AC88",
    margin: "0 0 3px 0",
  },
  timelineText: {
    fontSize: "1em",
    color: "#2c3e50",
    margin: 0,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    animation: "fadeIn 0.3s ease-in-out",
  },
  clientRequestCard: {
    width: "90%",
    maxWidth: "500px",
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    animation: "popIn 0.4s forwards",
  },
  requestTitle: {
    fontSize: "1.8em",
    color: "#B2AC88",
    marginTop: 0,
    marginBottom: "20px",
    textAlign: "center",
    fontFamily: "Sage, serif",
  },
  clientDetails: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "25px",
    border: "1px solid #eee",
  },
  clientDetailItem: {
    fontSize: "1.1em",
    margin: "10px 0",
    color: "#2c3e50",
  },
  detailLabel: {
    fontWeight: "bold",
    minWidth: "100px",
    display: "inline-block",
    color: "#555",
  },
  requestActions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "15px",
  },
  acceptButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 3px 8px rgba(39, 174, 96, 0.3)",
    transition: "all 0.3s ease",
  },
  acceptButton: {
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 12px rgba(39, 174, 96, 0.4)",
    }
  },
  declineButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#f1f1f1",
    color: "#555",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  autoAcceptMessage: {
    fontSize: "0.9em",
    color: "#777",
    textAlign: "center",
    fontStyle: "italic",
    margin: "10px 0 0 0",
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    }
  },
  "@keyframes popIn": {
    "0%": {
      transform: "scale(0.9)",
      opacity: 0,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    }
  }
};

export default AgentDashboard;