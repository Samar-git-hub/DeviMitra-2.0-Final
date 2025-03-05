import React, { useState, useRef, useEffect } from "react";
import "../styles/App.css";
import "../styles/ChatWindow.css";
import { Link } from "react-router-dom";

const IdeaValidator = ({ generateAnswer }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm your Comprehensive Startup Idea Validator. Share your concept, and I'll provide an in-depth analysis.",
      user: "AI"
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      // Add user message
      const userMessage = { text: input, user: "You" };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear input
      const currentInput = input;
      setInput("");

      // Set thinking state
      setIsThinking(true);

      try {
        // Enhanced prompt for comprehensive idea validation
        const enhancedPrompt = `
Provide a comprehensive startup idea validation analysis:

Startup Concept: ${currentInput}

Please analyze and provide insights in the following areas:

1. Idea Essence
- Core value proposition
- Unique selling points
- Primary problem being solved

2. Market Analysis
- Target market size
- Current market landscape
- Potential market growth
- Existing competitors

3. Feasibility Assessment
- Technical feasibility
- Resource requirements
- Implementation challenges
- MVP timeline

4. Business Model
- Potential revenue streams
- Pricing strategy
- Customer acquisition approach
- Scalability potential

5. Risk Evaluation
- Market risks
- Technical risks
- Potential regulatory challenges

6. Recommendations
- Suggested next steps
- Validation strategies
- Potential pivots to consider

Provide a clear, structured, and actionable analysis.
        `;

        // Get AI response using generateAnswer
        const analysis = await generateAnswer(enhancedPrompt);

        // Remove asterisks from AI response
        const cleanAnalysis = analysis.replace(/\*/g, '');

        // Add AI response
        setMessages(prev => [...prev, { text: cleanAnalysis, user: "AI" }]);
      } catch (error) {
        // Handle error
        setMessages(prev => [...prev, { 
          text: "Oops! Our idea validation tool encountered a hiccup. Let's try again!", 
          user: "AI" 
        }]);
      } finally {
        // Reset thinking state
        setIsThinking(false);
      }
    }
  };

  return (
    <div className="chat-container" style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>SageSeed</div>
        <nav>
          <ul style={styles.navList}>
            <li><Link to="/" style={styles.navLink}>Home</Link></li>
            <li><Link to="/features" style={styles.navLink}>Features</Link></li>
            <li><Link to="/contact" style={styles.navLink}>Contact</Link></li>
            <li><Link to="/about" style={styles.navLink}>About</Link></li>
          </ul>
        </nav>
      </header>
      
      <div style={styles.chatBox} className="chat-box">
        <div style={styles.chatHeader}>
          <h2 style={styles.chatTitle}>Startup Idea Validator Pro</h2>
          <p style={styles.chatSubtitle}>Comprehensive Analysis & Insights</p>
        </div>

        <div style={styles.messages} className="messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              style={msg.user === "You" ? styles.userMessage : styles.aiMessage}
              className={msg.user === "You" ? "message user" : "message ai"}
            >
              {msg.text}
            </div>
          ))}
          {isThinking && (
            <div style={styles.aiMessage} className="message ai">
              Analyzing your startup idea in depth... 
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={styles.inputArea} className="input-area">
          <input
            style={styles.input}
            type="text"
            placeholder="Describe your comprehensive startup concept..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button 
            style={styles.sendButton} 
            onClick={handleSend} 
            disabled={isThinking}
          >
            {isThinking ? "Analyzing..." : "Validate Idea"}
          </button>
        </div>

        <div style={styles.quickActions}>
          {[
            { 
              text: "Startup Concept", 
              placeholder: "I'm building a platform that helps... Our target is... The key innovation is..." 
            },
            { 
              text: "Problem & Solution", 
              placeholder: "The problem I'm solving is... My solution approach is... It's different because..." 
            },
            { 
              text: "Market Potential", 
              placeholder: "My target market is... The market size is approximately... The growth potential is..." 
            }
          ].map((action, index) => (
            <button 
              key={index}
              style={styles.quickActionButton}
              onClick={() => setInput(action.placeholder)}
            >
              {action.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: '1200px',
  },
  logo: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#B2AC88',
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
    transition: '0.3s',
  },
  chatBox: {
    width: '95%', // Wider
    maxWidth: '900px', // Increased max-width
    height: '80vh', // Taller
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '2px solid #B2AC88',
  },
  chatHeader: {
    backgroundColor: '#B2AC88',
    color: 'white',
    padding: '5px',
    textAlign: 'center',
  },
  chatTitle: {
    margin: 0,
    fontSize: '1.5em',
    color: '#B2AC88',
  },
  chatSubtitle: {
    margin: 0,
    fontSize: '0.9em',
    opacity: 0.8,
    color: '#B2AC88',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
  },
  userMessage: {
    backgroundColor: '#B2AC88',
    color: 'white',
    alignSelf: 'flex-end',
    borderRadius: '12px',
    padding: '15px',
    margin: '10px 0',
    maxWidth: '85%',
    wordWrap: 'break-word',
  },
  aiMessage: {
    backgroundColor: '#f1f1f1',
    color: '#333',
    alignSelf: 'flex-start',
    borderRadius: '12px',
    padding: '15px',
    margin: '10px 0',
    maxWidth: '85%',
    wordWrap: 'break-word',
  },
  inputArea: {
    display: 'flex',
    padding: '15px',
    backgroundColor: 'white',
    borderTop: '1px solid #eee',
  },
  input: {
    flex: 1,
    padding: '15px',
    borderRadius: '20px',
    border: '1px solid #B2AC88',
    marginRight: '15px',
    fontSize: '1em',
  },
  sendButton: {
    backgroundColor: '#B2AC88',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  quickActions: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  quickActionButton: {
    backgroundColor: 'white',
    border: '1px solid #B2AC88',
    color: '#B2AC88',
    borderRadius: '20px',
    padding: '8px 15px',
    margin: '0 5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default IdeaValidator;