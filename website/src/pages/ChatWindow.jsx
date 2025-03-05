import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";
import "../styles/ChatWindow.css";

const ChatWindow = ({ generateAnswer, detectLanguage, translateText }) => {
  const [messages, setMessages] = useState([
    { 
      text: "नमस्ते! मैं आपका रियल एस्टेट सहायक हूँ। आप किस भाषा में बात करना चाहेंगे?", 
      translation: "Hello! I'm DeviMitra, your real estate assistant. What language would you prefer to speak in?",
      detectedLanguage: "Hindi",
      user: "AI" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    name: "",
    preferences: [],
    budget: "",
    areas: [],
    contactInfo: ""
  });
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [showTranslations, setShowTranslations] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Languages supported
  const languages = ["English", "Hindi", "Marathi", "Telugu"];

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Extract client information from conversation
  useEffect(() => {
    if (messages.length > 3) {
      extractClientInfo();
    }
  }, [messages]);

  const extractClientInfo = async () => {
    const lastFiveMessages = messages.slice(-5);
    const conversationText = lastFiveMessages.map(msg => msg.text).join("\n");
    
    try {
      const prompt = `
        Extract the following client information from this real estate conversation if present:
        - Client name
        - Property preferences (e.g., 2BHK, villa, commercial)
        - Budget range
        - Preferred areas
        - Contact information
        
        Only extract information that is explicitly mentioned. Format as JSON.
        
        Conversation:
        ${conversationText}
      `;
      
      const response = await generateAnswer(prompt);
      try {
        const extractedInfo = JSON.parse(response);
        setClientInfo(prevInfo => ({
          name: extractedInfo.name || prevInfo.name,
          preferences: extractedInfo.preferences || prevInfo.preferences,
          budget: extractedInfo.budget || prevInfo.budget,
          areas: extractedInfo.areas || prevInfo.areas,
          contactInfo: extractedInfo.contactInfo || prevInfo.contactInfo
        }));
      } catch (e) {
        console.error("Failed to parse extracted info:", e);
      }
    } catch (error) {
      console.error("Error extracting client info:", error);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true);
      
      // Detect language of user input
      const detectedLang = await detectLanguage(input);
      
      // Add user message
      const userMessage = { 
        text: input, 
        detectedLanguage: detectedLang,
        user: "You" 
      };
      
      // If user input is not in preferred language, add translation
      if (detectedLang.toLowerCase() !== preferredLanguage.toLowerCase() && 
          detectedLang.toLowerCase() !== "unknown") {
        userMessage.translation = await translateText(input, preferredLanguage);
      }
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Clear input
      const currentInput = input;
      setInput("");

      try {
        // Generate response in the detected language or preferred language
        const responseLanguage = detectedLang !== "Unknown" ? detectedLang : preferredLanguage;
        const aiResponse = await generateAnswer(currentInput, responseLanguage);
        
        // Translate AI response if needed
        const aiMessage = { 
          text: aiResponse, 
          detectedLanguage: responseLanguage,
          user: "AI" 
        };
        
        // If AI response is not in preferred language, add translation
        if (responseLanguage.toLowerCase() !== preferredLanguage.toLowerCase()) {
          aiMessage.translation = await translateText(aiResponse, preferredLanguage);
        }
        
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } catch (error) {
        // Handle error
        setMessages(prevMessages => [
          ...prevMessages, 
          { text: "Sorry, I couldn't process your request.", user: "AI" }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorder.addEventListener("stop", handleStop);
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordedChunks([]);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks(prev => [...prev, event.data]);
    }
  };

  const handleStop = async () => {
    const audioBlob = new Blob(recordedChunks, { type: "audio/webm" });
    
    // Here you would typically send the audio to a speech-to-text service
    // For demo purposes, we'll just simulate a transcription
    setIsLoading(true);
    
    setTimeout(async () => {
      // Simulated transcription (in a real app, send to API)
      const simulatedTranscriptions = [
        "मुझे 3 बेडरूम का अपार्टमेंट चाहिए",
        "मेरा बजट 50 लाख तक है",
        "I want to buy a flat in Bandra or Andheri",
        "నాకు హైదరాబాద్ లో 2BHK కావాలి"
      ];
      
      const randomIndex = Math.floor(Math.random() * simulatedTranscriptions.length);
      const transcription = simulatedTranscriptions[randomIndex];
      
      setInput(transcription);
      setIsLoading(false);
    }, 2000);
  };

  const saveConversation = () => {
    const conversationData = {
      timestamp: new Date().toISOString(),
      client: clientInfo.name || "Unknown Client",
      messages: messages,
      clientInfo: clientInfo
    };
    
    // In a real app, you would send this to a backend API
    // For now, we'll just save to localStorage
    const savedConversations = JSON.parse(localStorage.getItem("realEstateConversations") || "[]");
    savedConversations.push(conversationData);
    localStorage.setItem("realEstateConversations", JSON.stringify(savedConversations));
    
    alert("Conversation saved successfully!");
  };

  const setLanguagePreference = (language) => {
    setPreferredLanguage(language);
    const message = {
      text: `Language preference set to ${language}. I'll try to respond in ${language} when possible.`,
      user: "AI"
    };
    setMessages(prevMessages => [...prevMessages, message]);
  };

  return (
    <div className="chat-container">
      <header>
        <div className="logo">DeviMitra</div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>
      </header>
      
      <div className="chat-box" style={{ width: '90%', maxWidth: '1000px', marginTop: '80px' }}>
        <div style={styles.chatHeader}>
          <h2 style={styles.chatTitle}>Multilingual Client Communication</h2>
          <div style={styles.controlsRow}>
            <div style={styles.languageSelector}>
              <span>Preferred Language: </span>
              <select 
                value={preferredLanguage} 
                onChange={(e) => setLanguagePreference(e.target.value)}
                style={styles.select}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.toggleLabel}>
                <input 
                  type="checkbox" 
                  checked={showTranslations} 
                  onChange={() => setShowTranslations(!showTranslations)}
                  style={styles.checkbox}
                />
                Show Translations
              </label>
            </div>
          </div>
        </div>

        <div style={styles.conversationContainer}>
          <div className="messages" style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.user === "You" ? "user" : "ai"}`}
                style={msg.user === "You" ? styles.userMessage : styles.aiMessage}
              >
                <div style={styles.messageHeader}>
                  <span style={styles.userName}>{msg.user}</span>
                  {msg.detectedLanguage && (
                    <span style={styles.languageTag}>{msg.detectedLanguage}</span>
                  )}
                </div>
                <p style={styles.messageText}>{msg.text}</p>
                {showTranslations && msg.translation && (
                  <p style={styles.translation}>Translation: {msg.translation}</p>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message ai" style={styles.aiMessage}>
                <div style={styles.typingIndicator}>
                  <span style={styles.typingDot}></span>
                  <span style={styles.typingDot}></span>
                  <span style={styles.typingDot}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Client Information Panel */}
          <div style={styles.clientInfoPanel}>
            <h3 style={styles.panelTitle}>Client Information</h3>
            <div style={styles.clientInfoContent}>
              <p><strong>Name:</strong> {clientInfo.name || "Not provided yet"}</p>
              <p><strong>Preferences:</strong> {clientInfo.preferences.join(", ") || "Not provided yet"}</p>
              <p><strong>Budget:</strong> {clientInfo.budget || "Not provided yet"}</p>
              <p><strong>Areas:</strong> {clientInfo.areas.join(", ") || "Not provided yet"}</p>
              <p><strong>Contact:</strong> {clientInfo.contactInfo || "Not provided yet"}</p>
            </div>
            <div style={styles.actionButtons}>
              <button style={styles.actionButton} onClick={saveConversation}>
                Save Conversation
              </button>
              <Link to="/transcript-viewer">
                <button style={styles.actionButton}>
                  View Transcripts
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="input-area" style={styles.inputArea}>
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              ...styles.voiceButton,
              background: isRecording ? '#d9534f' : '#B2AC88'
            }}
          >
            {isRecording ? 'Stop' : 'Voice'}
          </button>
          <input
            type="text"
            placeholder="Type in any language (हिंदी, मराठी, తెలుగు, English)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            style={styles.input}
          />
          <button 
            onClick={handleSend} 
            className="send-button"
            disabled={isLoading}
            style={styles.sendButton}
          >
            Send
          </button>
        </div>

        <div style={styles.quickPrompts}>
          <button onClick={() => setInput("मुझे 2BHK अपार्टमेंट दिखाइए")} style={styles.promptButton}>
            मुझे 2BHK अपार्टमेंट दिखाइए
          </button>
          <button onClick={() => setInput("What's your best price for this property?")} style={styles.promptButton}>
            What's your best price?
          </button>
          <button onClick={() => setInput("मला लोखंडवाला मध्ये फ्लॅट हवा आहे")} style={styles.promptButton}>
            मला लोखंडवाला मध्ये फ्लॅट हवा आहे
          </button>
          <button onClick={() => setInput("నాకు గాచిబౌలి లో విల్లా కావాలి")} style={styles.promptButton}>
            నాకు గాచిబౌలి లో విల్లా కావాలి
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  chatHeader: {
    backgroundColor: '#B2AC88',
    color: 'white',
    padding: '15px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  chatTitle: {
    margin: 0,
    fontSize: '1.5em',
    textAlign: 'center',
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  languageSelector: {
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    padding: '5px',
    marginLeft: '5px',
    borderRadius: '5px',
    border: 'none',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '5px',
  },
  conversationContainer: {
    display: 'flex',
    height: '60vh',
  },
  messagesContainer: {
    flex: '3',
    padding: '15px',
    overflowY: 'auto',
    borderRight: '1px solid #eee',
  },
  clientInfoPanel: {
    flex: '1',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
  },
  panelTitle: {
    color: '#B2AC88',
    marginBottom: '15px',
    textAlign: 'center',
  },
  clientInfoContent: {
    flex: '1',
  },
  actionButtons: {
    marginTop: '15px',
  },
  actionButton: {
    backgroundColor: '#B2AC88',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '8px',
    width: '100%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#B2AC88',
    color: 'white',
    borderRadius: '10px 10px 0 10px',
    padding: '10px',
    marginBottom: '10px',
    maxWidth: '70%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    color: '#333',
    borderRadius: '10px 10px 10px 0',
    padding: '10px',
    marginBottom: '10px',
    maxWidth: '70%',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  userName: {
    fontWeight: 'bold',
  },
  languageTag: {
    fontSize: '0.8em',
    padding: '2px 5px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '3px',
  },
  messageText: {
    margin: 0,
  },
  translation: {
    margin: '5px 0 0 0',
    fontSize: '0.9em',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  typingIndicator: {
    display: 'flex',
    gap: '5px',
  },
  typingDot: {
    height: '8px',
    width: '8px',
    backgroundColor: '#B2AC88',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'bounce 1.4s infinite ease-in-out both',
  },
  inputArea: {
    display: 'flex',
    padding: '15px',
    borderTop: '1px solid #eee',
  },
  voiceButton: {
    padding: '10px 15px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  input: {
    flex: '1',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1em',
  },
  sendButton: {
    backgroundColor: '#B2AC88',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    marginLeft: '10px',
    cursor: 'pointer',
  },
  quickPrompts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '15px',
    borderTop: '1px solid #eee',
    justifyContent: 'center',
  },
  promptButton: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    padding: '8px 12px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
};

export default ChatWindow;