import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

const TranscriptViewer = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = JSON.parse(localStorage.getItem("realEstateConversations") || "[]");
    setConversations(savedConversations);
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedConversations = () => {
    let result = [...conversations];
    
    // Apply filtering
    if (filterQuery) {
      result = result.filter(conversation => {
        const clientName = conversation.client.toLowerCase();
        const messagesText = conversation.messages.map(m => m.text.toLowerCase()).join(" ");
        const query = filterQuery.toLowerCase();
        
        return clientName.includes(query) || messagesText.includes(query);
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === "date") {
        valueA = new Date(a.timestamp);
        valueB = new Date(b.timestamp);
      } else if (sortBy === "client") {
        valueA = a.client;
        valueB = b.client;
      }
      
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return result;
  };

  const extractKeyInsights = (conversation) => {
    const insights = [];
    
    // Property preferences
    if (conversation.clientInfo.preferences && conversation.clientInfo.preferences.length > 0) {
      insights.push(`Property type: ${conversation.clientInfo.preferences.join(", ")}`);
    }
    
    // Budget
    if (conversation.clientInfo.budget) {
      insights.push(`Budget: ${conversation.clientInfo.budget}`);
    }
    
    // Areas
    if (conversation.clientInfo.areas && conversation.clientInfo.areas.length > 0) {
      insights.push(`Areas: ${conversation.clientInfo.areas.join(", ")}`);
    }
    
    return insights;
  };

  const findFollowUps = (conversation) => {
    const followUpKeywords = ["call back", "follow up", "contact", "schedule", "visit", "tour", "tomorrow", "next week"];
    const followUps = [];
    
    conversation.messages.forEach(message => {
      const text = message.text.toLowerCase();
      
      followUpKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          const sentenceWithKeyword = message.text.split(/[.!?]/).find(sentence => 
            sentence.toLowerCase().includes(keyword)
          );
          
          if (sentenceWithKeyword && !followUps.includes(sentenceWithKeyword.trim())) {
            followUps.push(sentenceWithKeyword.trim());
          }
        }
      });
    });
    
    return followUps;
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
        <h1 style={styles.title}>Conversation Transcripts</h1>
        
        <div style={styles.searchAndSort}>
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search conversations..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.sortControls}>
            <span>Sort by: </span>
            <button 
              style={{
                ...styles.sortButton,
                fontWeight: sortBy === "date" ? "bold" : "normal"
              }} 
              onClick={() => handleSort("date")}
            >
              Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button 
              style={{
                ...styles.sortButton,
                fontWeight: sortBy === "client" ? "bold" : "normal"
              }} 
              onClick={() => handleSort("client")}
            >
              Client {sortBy === "client" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.conversationList}>
            <h2 style={styles.sectionTitle}>Saved Conversations</h2>
            
            {filteredAndSortedConversations().length === 0 ? (
              <p style={styles.emptyState}>No conversations found. Start a new conversation to see it here.</p>
            ) : (
              filteredAndSortedConversations().map((conversation, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.conversationCard,
                    backgroundColor: selectedConversation === conversation ? '#f0f0f0' : 'white'
                  }}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div style={styles.conversationHeader}>
                    <h3 style={styles.clientName}>{conversation.client}</h3>
                    <span style={styles.timestamp}>
                      {new Date(conversation.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={styles.conversationPreview}>
                    <p style={styles.previewText}>
                      {conversation.messages[0].text.substring(0, 100)}...
                    </p>
                  </div>
                  
                  <div style={styles.languages}>
                    {Array.from(new Set(conversation.messages
                      .filter(msg => msg.detectedLanguage)
                      .map(msg => msg.detectedLanguage)))
                      .map(language => (
                        <span key={language} style={styles.languageTag}>
                          {language}
                        </span>
                      ))
                    }
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={styles.conversationDetail}>
            {selectedConversation ? (
              <>
                <div style={styles.detailHeader}>
                  <h2 style={styles.detailTitle}>
                    Conversation with {selectedConversation.client}
                  </h2>
                  <span style={styles.detailTimestamp}>
                    {new Date(selectedConversation.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div style={styles.insightsPanel}>
                  <h3 style={styles.insightsTitle}>Key Insights</h3>
                  <ul style={styles.insightsList}>
                    {extractKeyInsights(selectedConversation).map((insight, idx) => (
                      <li key={idx} style={styles.insightItem}>{insight}</li>
                    ))}
                  </ul>
                  
                  <h3 style={styles.followUpsTitle}>Follow-up Actions</h3>
                  <ul style={styles.followUpsList}>
                    {findFollowUps(selectedConversation).length > 0 ? (
                      findFollowUps(selectedConversation).map((followUp, idx) => (
                        <li key={idx} style={styles.followUpItem}>{followUp}</li>
                      ))
                    ) : (
                      <li style={styles.noFollowUps}>No follow-up actions detected</li>
                    )}
                  </ul>
                </div>
                
                <div style={styles.messagesList}>
                  {selectedConversation.messages.map((message, idx) => (
                    <div 
                      key={idx}
                      style={{
                        ...styles.messageItem,
                        alignSelf: message.user === "You" ? "flex-end" : "flex-start",
                        backgroundColor: message.user === "You" ? "#B2AC88" : "#f1f1f1",
                        color: message.user === "You" ? "white" : "#333"
                      }}
                    >
                      <div style={styles.messageHeader}>
                        <span style={styles.messageUser}>{message.user}</span>
                        {message.detectedLanguage && (
                          <span style={styles.messageLang}>{message.detectedLanguage}</span>
                        )}
                      </div>
                      
                      <p style={styles.messageText}>{message.text}</p>
                      
                      {message.translation && (
                        <p style={styles.messageTranslation}>
                          Translation: {message.translation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div style={styles.actionsBar}>
                  <Link to="/chatwindow">
                    <button style={styles.actionButton}>Continue Conversation</button>
                  </Link>
                  <button 
                    style={styles.actionButton}
                    onClick={() => {
                      const updatedConversations = conversations.filter(c => c !== selectedConversation);
                      setConversations(updatedConversations);
                      localStorage.setItem("realEstateConversations", JSON.stringify(updatedConversations));
                      setSelectedConversation(null);
                    }}
                  >
                    Delete Conversation
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.noSelectionState}>
                <p style={styles.noSelectionText}>
                  Select a conversation from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    background: 'rgba(255, 255, 255, 0.8)',
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
    maxWidth: '1200px',
    margin: '0 auto 40px',
    padding: '120px 20px 20px 20px', // Increased top padding to avoid navbar overlap
  },
  title: {
    fontSize: '2.5em',
    color: '#B2AC88',
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchAndSort: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  searchBar: {
    flex: '1',
    maxWidth: '400px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    fontSize: '1em',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  sortControls: {
    display: 'flex',
    alignItems: 'center',
  },
  sortButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px 10px',
    marginLeft: '10px',
    fontSize: '1em',
    color: '#2c3e50',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '20px',
    minHeight: '70vh',
  },
  conversationList: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflowY: 'auto',
    maxHeight: '80vh',
  },
  sectionTitle: {
    color: '#B2AC88',
    marginBottom: '15px',
    fontSize: '1.3em',
  },
  emptyState: {
    textAlign: 'center',
    color: '#777',
    margin: '40px 0',
  },
  conversationCard: {
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  clientName: {
    margin: 0,
    fontSize: '1.1em',
    color: '#2c3e50',
  },
  timestamp: {
    fontSize: '0.8em',
    color: '#777',
  },
  conversationPreview: {
    marginBottom: '10px',
  },
  previewText: {
    margin: 0,
    fontSize: '0.9em',
    color: '#555',
  },
  languages: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
  },
  languageTag: {
    fontSize: '0.8em',
    padding: '2px 6px',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    color: '#555',
  },
  conversationDetail: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  detailHeader: {
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    margin: 0,
    color: '#B2AC88',
    fontSize: '1.5em',
  },
  detailTimestamp: {
    color: '#777',
  },
  insightsPanel: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  insightsTitle: {
    color: '#B2AC88',
    marginTop: 0,
    marginBottom: '10px',
    fontSize: '1.2em',
  },
  insightsList: {
    marginBottom: '20px',
  },
  insightItem: {
    margin: '5px 0',
  },
  followUpsTitle: {
    color: '#B2AC88',
    marginBottom: '10px',
    fontSize: '1.2em',
  },
  followUpsList: {},
  followUpItem: {
    margin: '5px 0',
    backgroundColor: '#fff3cd',
    padding: '5px 10px',
    borderRadius: '3px',
  },
  noFollowUps: {
    fontStyle: 'italic',
    color: '#777',
  },
  messagesList: {
    flex: '1',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  messageItem: {
    padding: '10px 15px',
    borderRadius: '10px',
    maxWidth: '70%',
    marginBottom: '10px',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  messageUser: {
    fontWeight: 'bold',
  },
  messageLang: {
    fontSize: '0.8em',
    padding: '1px 5px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '3px',
  },
  messageText: {
    margin: 0,
  },
  messageTranslation: {
    margin: '5px 0 0 0',
    fontSize: '0.9em',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  actionsBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#B2AC88',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
  },
  noSelectionState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  noSelectionText: {
    color: '#777',
    fontSize: '1.2em',
    textAlign: 'center',
  }
};

export default TranscriptViewer;