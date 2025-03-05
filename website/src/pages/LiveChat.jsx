import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/App.css";

// Import our service modules
import { detectLanguage, translateText, simulateTranslation } from "../translationService.js";
import { createConversationRecord, saveTranscript, exportTranscriptAsFile } from "../transcriptService.js";
import { extractRequirementsWithGemini, extractRequirementsSimple } from "../requirementsExtraction.js";

const LiveChat = () => {
    const location = useLocation();
    const { requestId } = location.state;
    const socketRef = useRef(null);

    useEffect(() => {
        // Connect to the server using Socket.IO
        socketRef.current = io("http://localhost:3000");

    // Clean up the socket connection on component unmount
    return () => {
        socketRef.current.disconnect();
      };
    }, []);
    
// const LiveChat = ({ generateAnswer }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isClient, isAgent, clientName, clientLanguage, agentName, agentLanguages, preferredLanguage } = location.state || {};
  
//   // If someone tries to access this page directly without proper state, redirect to selection
//   useEffect(() => {
//     if (!location.state) {
//       navigate("/user-type-selection");
//     }
//   }, [location.state, navigate]);
  
  // State for conversation
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(
    preferredLanguage || clientLanguage || "English"
  );
  const [showTranslations, setShowTranslations] = useState(true);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [keyPoints, setKeyPoints] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Conversation record for saving transcript
  const [conversationRecord, setConversationRecord] = useState(null);
  
  // Initialize conversation record
  useEffect(() => {
    if (location.state) {
      const record = createConversationRecord(
        clientName || "Neha", 
        clientLanguage || activeLanguage,
        agentName || "Rahul",
        agentLanguages || ["Hindi", "English", "Marathi"]
      );
      setConversationRecord(record);
    }
  }, [location.state]);

  // Welcome messages based on user type
  useEffect(() => {
    let initialMessages = [];
    
    if (isClient) {
      initialMessages = [
        {
          text: "Welcome to PropTalk! You're now connected with Agent Rahul.",
          user: "System",
          timestamp: new Date().toISOString()
        },
        {
          text: "नमस्ते! मैं राहुल, आपका रियल एस्टेट एजेंट हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
          translation: "Hello! I'm Rahul, your real estate agent. How can I help you today?",
          detectedLanguage: "Hindi",
          user: "Agent",
          timestamp: new Date().toISOString()
        }
      ];
    } else if (isAgent) {
      initialMessages = [
        {
          text: "Welcome to PropTalk! You're now connected with Client Neha.",
          user: "System",
          timestamp: new Date().toISOString()
        },
        {
          text: "Hello! I'm looking for a 2BHK apartment in Andheri or Bandra area.",
          detectedLanguage: "English",
          user: "Client",
          timestamp: new Date().toISOString()
        }
      ];
    }
    
    setMessages(initialMessages);
  }, [isClient, isAgent]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Extract key points from conversation
  useEffect(() => {
    if (messages.length > 3) {
      // In real app, we'd use Gemini API
      // extractRequirementsWithGemini(messages, isClient)
      //   .then(requirements => setKeyPoints(requirements))
      //   .catch(err => console.error("Failed to extract requirements:", err));
      
      // For demo, use simple extraction
      const requirements = extractRequirementsSimple(messages, isClient);
      setKeyPoints(requirements);
    }
  }, [messages]);
  
  // Simulate agent typing
  useEffect(() => {
    let typingTimeout;
    if (isClient && messages.length > 0 && messages[messages.length - 1].user === "You") {
      setIsTyping(true);
      
      // Simulate agent response time (2-4 seconds)
      const responseTime = 2000 + Math.random() * 2000;
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
        simulateAgentResponse();
      }, responseTime);
    }
    
    return () => clearTimeout(typingTimeout);
  }, [messages, isClient]);
  
  // Simulate agent responses
  const simulateAgentResponse = async () => {
    const lastMessage = messages[messages.length - 1];
    let responseText = "";
    let detectedLang = "Hindi";
    
    // Check if client asked about property
    if (/property|apartment|flat|house|villa|अपार्टमेंट|फ्लैट|प्रॉपर्टी/.test(lastMessage.text.toLowerCase())) {
      // Suggest a property
      setPropertyDetails({
        name: "Sunshine Towers",
        type: "2BHK Apartment",
        location: "Andheri West, Mumbai",
        price: "₹85 Lakhs",
        area: "950 sq.ft.",
        amenities: ["Parking", "Garden", "Gym", "24/7 Security"],
        imageUrl: "https://example.com/property-image.jpg"
      });
      
      responseText = "मुझे आपकी जरूरतों के अनुसार एक अच्छा अपार्टमेंट मिला है। यह अंधेरी वेस्ट में सनशाइन टावर्स में 2BHK अपार्टमेंट है, जिसकी कीमत ₹85 लाख है। क्या आप इसके बारे में अधिक जानकारी चाहते हैं?";
    } else if (/price|cost|budget|कीमत|बजट/.test(lastMessage.text.toLowerCase())) {
      responseText = "अंधेरी और बांद्रा क्षेत्र में 2BHK अपार्टमेंट की कीमत ₹75 लाख से ₹1.2 करोड़ के बीच है। आपका बजट क्या है?";
    } else if (/time|visit|when|कब|विजिट/.test(lastMessage.text.toLowerCase())) {
      responseText = "हम आज या कल प्रॉपर्टी विजिट की व्यवस्था कर सकते हैं। आपके लिए कौन सा समय सुविधाजनक होगा?";
    } else {
      responseText = "आपकी जरूरतों के अनुसार मैं आपको 2-3 अच्छे विकल्प दिखा सकता हूँ। क्या आपके पास कोई विशिष्ट आवश्यकताएँ हैं जैसे पार्किंग, गार्डन, या जिम?";
    }
    
    // In a real app, we'd use the translate API
    // const translation = await translateText(responseText, "English");
    
    // For demo, use simplified translation
    const translation = "I can show you 2-3 good options according to your requirements. Do you have any specific needs like parking, garden, or gym?";
    
    setMessages(prev => [...prev, {
      text: responseText,
      translation: translation,
      detectedLanguage: detectedLang,
      user: "Agent",
      timestamp: new Date().toISOString()
    }]);
  };
  
  // Handle sending message
  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true);
      
      // In a real app, we'd use the detect language API
      // const detectedLang = await detectLanguage(input);
      
      // For demo, use simplified detection
      const detectedLang = input.match(/[\u0900-\u097F]/) ? "Hindi" : "English";
      
      // Add user message
      const userMessage = { 
        text: input, 
        detectedLanguage: detectedLang,
        user: isClient ? "You" : "Agent",
        timestamp: new Date().toISOString()
      };
      
      // Add translation if needed
      if (detectedLang.toLowerCase() !== activeLanguage.toLowerCase() && 
          detectedLang.toLowerCase() !== "unknown") {
        // In a real app, we'd use the translate API
        // userMessage.translation = await translateText(input, activeLanguage);
        
        // For demo, use simplified translation
        userMessage.translation = simulateTranslation(input, activeLanguage);
      }
      
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsLoading(false);
      
      // If agent, simulate client response after a delay
      if (isAgent) {
        simulateClientResponse();
      }
    }
  };
  
  // Simulate client response (when user is an agent)
  const simulateClientResponse = () => {
    setIsTyping(true);
    
    // Delay for realistic typing simulation (2-3 seconds)
    setTimeout(() => {
      setIsTyping(false);
      
      const clientResponses = [
        {
          text: "हां, मेरा बजट 80-90 लाख के बीच है। और मुझे पार्किंग और जिम वाला अपार्टमेंट चाहिए।",
          translation: "Yes, my budget is between 80-90 lakhs. And I need an apartment with parking and gym.",
          detectedLanguage: "Hindi"
        },
        {
          text: "क्या आप मुझे एक अच्छा 2BHK अपार्टमेंट दिखा सकते हैं?",
          translation: "Can you show me a good 2BHK apartment?",
          detectedLanguage: "Hindi"
        },
        {
          text: "आज शाम 5 बजे प्रॉपर्टी विजिट कर सकते हैं?",
          translation: "Can we do a property visit today at 5 PM?",
          detectedLanguage: "Hindi"
        }
      ];
      
      // Pick a response based on conversation context
      const randomIndex = Math.floor(Math.random() * clientResponses.length);
      const response = clientResponses[randomIndex];
      
      setMessages(prev => [...prev, {
        ...response,
        user: "Client",
        timestamp: new Date().toISOString()
      }]);
      
      // Show property if client asks
      if (randomIndex === 1) {
        setPropertyDetails({
          name: "Sunshine Towers",
          type: "2BHK Apartment",
          location: "Andheri West, Mumbai",
          price: "₹85 Lakhs",
          area: "950 sq.ft.",
          amenities: ["Parking", "Garden", "Gym", "24/7 Security"],
          imageUrl: "https://example.com/property-image.jpg"
        });
      }
    }, 2000 + Math.random() * 1000);
  };
  
  // End conversation and save transcript
  const endConversation = () => {
    if (conversationRecord) {
      const savedTranscript = saveTranscript(
        conversationRecord,
        messages,
        keyPoints,
        propertyDetails
      );
      
      // Export transcript
      exportTranscriptAsFile(savedTranscript);
      
      alert("Conversation saved successfully!");
    }
    
    navigate("/");
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
        <div style={styles.chatInterface}>
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderLeft}>
              <div style={styles.profileIcon}>
                {isClient ? "👨🏽‍💼" : "👩🏻"}
              </div>
              <div style={styles.chatHeaderInfo}>
                <h2 style={styles.chatName}>
                  {isClient ? "Agent Rahul" : "Client Neha"}
                </h2>
                <p style={styles.chatStatus}>
                  {isClient ? "Real Estate Expert • Online" : "Looking for 2BHK in Mumbai"}
                </p>
              </div>
            </div>
            <div style={styles.chatHeaderRight}>
              <div style={styles.languageSelector}>
                <span style={styles.languageLabel}>Language:</span>
                <select
                  value={activeLanguage}
                  onChange={(e) => setActiveLanguage(e.target.value)}
                  style={styles.languageSelect}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
              <label style={styles.translationToggle}>
                <input
                  type="checkbox"
                  checked={showTranslations}
                  onChange={() => setShowTranslations(!showTranslations)}
                  style={styles.checkbox}
                />
                <span style={styles.toggleLabel}>Show Translations</span>
              </label>
            </div>
          </div>
          
          <div style={styles.chatBody}>
            <div style={styles.messagesContainer}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.messageItem,
                    alignSelf: message.user === "System" 
                      ? "center" 
                      : message.user === (isClient ? "You" : "Agent") 
                        ? "flex-end" 
                        : "flex-start",
                    backgroundColor: message.user === "System"
                      ? "#f1f1f1"
                      : message.user === (isClient ? "You" : "Agent")
                        ? "#B2AC88"
                        : "#e3f2fd",
                    color: message.user === (isClient ? "You" : "Agent") ? "white" : "#333"
                  }}
                >
                  {message.user !== "System" && (
                    <div style={styles.messageHeader}>
                      <span style={styles.messageUser}>
                        {message.user}
                      </span>
                      {message.detectedLanguage && (
                        <span style={styles.languageTag}>
                          {message.detectedLanguage}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <p style={styles.messageText}>{message.text}</p>
                  
                  {showTranslations && message.translation && (
                    <p style={styles.translation}>
                      {message.translation}
                    </p>
                  )}
                  
                  <span style={styles.timestamp}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
              
              {isTyping && (
                <div
                  style={{
                    ...styles.messageItem,
                    alignSelf: isClient ? "flex-start" : "flex-end",
                    backgroundColor: isClient ? "#e3f2fd" : "#B2AC88",
                    color: isClient ? "#333" : "white",
                    padding: "10px 15px"
                  }}
                >
                  <div style={styles.typingIndicator}>
                    <div style={styles.typingDot}></div>
                    <div style={styles.typingDot}></div>
                    <div style={styles.typingDot}></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div style={styles.inputArea}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type in any language...`}
                style={styles.textInput}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                style={styles.sendButton}
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        
        <div style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Conversation Details</h3>
            <div style={styles.sidebarContent}>
              <p style={styles.sidebarInfo}>
                <span style={styles.infoLabel}>Duration:</span>
                <span style={styles.infoValue}>12:34</span>
              </p>
              <p style={styles.sidebarInfo}>
                <span style={styles.infoLabel}>Languages:</span>
                <span style={styles.infoValue}>
                  {isClient ? "Hindi, English" : "Hindi, English"}
                </span>
              </p>
            </div>
          </div>
          
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Key Requirements</h3>
            <div style={styles.sidebarContent}>
              {keyPoints.length > 0 ? (
                <ul style={styles.keyPointsList}>
                  {keyPoints.map((point, index) => (
                    <li key={index} style={styles.keyPoint}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p style={styles.emptyState}>
                  Requirements will be extracted automatically during the conversation.
                </p>
              )}
            </div>
          </div>
          
          {propertyDetails && (
            <div style={styles.sidebarSection}>
              <h3 style={styles.sidebarTitle}>Property Details</h3>
              <div style={styles.propertyCard}>
                <h4 style={styles.propertyName}>{propertyDetails.name}</h4>
                <p style={styles.propertyType}>{propertyDetails.type}</p>
                <div style={styles.propertyImage}></div>
                <div style={styles.propertyInfo}>
                  <p style={styles.propertyDetail}>
                    <span style={styles.detailIcon}>📍</span>
                    {propertyDetails.location}
                  </p>
                  <p style={styles.propertyDetail}>
                    <span style={styles.detailIcon}>💰</span>
                    {propertyDetails.price}
                  </p>
                  <p style={styles.propertyDetail}>
                    <span style={styles.detailIcon}>📐</span>
                    {propertyDetails.area}
                  </p>
                </div>
                <div style={styles.amenitiesList}>
                  {propertyDetails.amenities.map((amenity, index) => (
                    <span key={index} style={styles.amenityTag}>{amenity}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Transcript Options</h3>
            <div style={styles.sidebarContent}>
              <p style={styles.transcriptInfo}>
                Transcripts are automatically saved with translations in all detected languages.
              </p>
              <div style={styles.transcriptButtons}>
                <button 
                  onClick={endConversation} 
                  style={styles.saveButton}
                >
                  Save & Export Transcript
                </button>
              </div>
            </div>
          </div>
          
          <div style={styles.actions}>
            <button
              onClick={endConversation}
              style={styles.endButton}
            >
              End Conversation
            </button>
          </div>
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
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "100px 20px 40px",
    display: "flex",
    gap: "30px",
  },
  chatInterface: {
    flex: "3",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    height: "75vh",
  },
  chatHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatHeaderLeft: {
    display: "flex",
    alignItems: "center",
  },
  profileIcon: {
    fontSize: "2em",
    marginRight: "15px",
  },
  chatHeaderInfo: {},
  chatName: {
    margin: "0 0 3px 0",
    fontSize: "1.2em",
    color: "#2c3e50",
  },
  chatStatus: {
    margin: 0,
    fontSize: "0.9em",
    color: "#777",
  },
  chatHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  languageSelector: {
    display: "flex",
    alignItems: "center",
  },
  languageLabel: {
    marginRight: "8px",
    fontSize: "0.9em",
    color: "#555",
  },
  languageSelect: {
    padding: "5px 10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "0.9em",
  },
  translationToggle: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
  },
  toggleLabel: {
    fontSize: "0.9em",
    color: "#555",
  },
  chatBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  messagesContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  messageItem: {
    maxWidth: "70%",
    padding: "12px 15px",
    borderRadius: "10px",
    position: "relative",
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
  },
  messageUser: {
    fontWeight: "bold",
    fontSize: "0.9em",
  },
  languageTag: {
    fontSize: "0.7em",
    padding: "2px 6px",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "10px",
    marginLeft: "5px",
  },
  messageText: {
    margin: "0",
    fontSize: "1em",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },
  translation: {
    margin: "8px 0 0 0",
    paddingTop: "8px",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    fontSize: "0.9em",
    fontStyle: "italic",
    opacity: 0.8,
  },
  timestamp: {
    position: "absolute",
    bottom: "-18px",
    right: "10px",
    fontSize: "0.7em",
    color: "#777",
  },
  typingIndicator: {
    display: "flex",
    gap: "5px",
  },
  typingDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "currentColor",
    opacity: 0.7,
    borderRadius: "50%",
    animation: "bounce 1.3s infinite ease-in-out both",
  },
  inputArea: {
    padding: "15px 20px",
    borderTop: "1px solid #eee",
    display: "flex",
    gap: "15px",
  },
  textInput: {
    flex: 1,
    padding: "12px 15px",
    borderRadius: "25px",
    border: "1px solid #ddd",
    fontSize: "1em",
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#B2AC88",
    color: "white",
    border: "none",
    padding: "0 20px",
    borderRadius: "25px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  sidebar: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sidebarSection: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    padding: "15px 20px",
  },
  sidebarTitle: {
    fontSize: "1.2em",
    color: "#B2AC88",
    marginTop: 0,
    marginBottom: "15px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  sidebarContent: {
    fontSize: "0.9em",
  },
  sidebarInfo: {
    margin: "8px 0",
  },
  infoLabel: {
    fontWeight: "bold",
    minWidth: "80px",
    display: "inline-block",
    color: "#555",
  },
  infoValue: {
    color: "#2c3e50",
  },
  keyPointsList: {
    paddingLeft: "20px",
    margin: "10px 0",
  },
  keyPoint: {
    margin: "8px 0",
    color: "#2c3e50",
  },
  emptyState: {
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
    padding: "10px 0",
  },
  propertyCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
  },
  propertyName: {
    margin: "0 0 5px 0",
    color: "#2c3e50",
  },
  propertyType: {
    margin: "0 0 10px 0",
    color: "#777",
    fontSize: "0.9em",
  },
  propertyImage: {
    width: "100%",
    height: "120px",
    backgroundColor: "#eee",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  propertyInfo: {
    marginBottom: "10px",
  },
  propertyDetail: {
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
  },
  detailIcon: {
    marginRight: "8px",
    fontSize: "1.1em",
  },
  amenitiesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  amenityTag: {
    backgroundColor: "#e3f2fd",
    color: "#2c3e50",
    padding: "3px 8px",
    borderRadius: "15px",
    fontSize: "0.8em",
  },
  transcriptInfo: {
    color: "#555",
    marginBottom: "15px",
  },
  transcriptButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  saveButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    fontSize: "0.9em",
    cursor: "pointer",
    textAlign: "center",
  },
  actions: {
    marginTop: "auto",
  },
  endButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    fontSize: "1em",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  }
}

export default LiveChat;