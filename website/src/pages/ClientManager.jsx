import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";
import Navbar from "../components/Navbar";

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: "",
    contact: "",
    language: "English",
    requirements: "",
    budget: "",
    locations: "",
    followUpDate: "",
    notes: ""
  });
  const [editingClient, setEditingClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");

  useEffect(() => {
    // Load clients from localStorage
    const savedClients = JSON.parse(localStorage.getItem("realEstateClients") || "[]");
    setClients(savedClients);
  }, []);

  useEffect(() => {
    // Check if there are any follow-ups due today
    const today = new Date().toISOString().split('T')[0];
    const followUpsDue = clients.filter(client => client.followUpDate === today);
    
    if (followUpsDue.length > 0) {
      alert(`You have ${followUpsDue.length} follow-ups scheduled for today!`);
    }
  }, [clients]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingClient) {
      setEditingClient({
        ...editingClient,
        [name]: value
      });
    } else {
      setNewClient({
        ...newClient,
        [name]: value
      });
    }
  };

  const saveClient = () => {
    if (editingClient) {
      // Update existing client
      const updatedClients = clients.map(client => 
        client.id === editingClient.id ? editingClient : client
      );
      setClients(updatedClients);
      localStorage.setItem("realEstateClients", JSON.stringify(updatedClients));
      setEditingClient(null);
    } else {
      // Add new client
      const client = {
        ...newClient,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedClients = [...clients, client];
      setClients(updatedClients);
      localStorage.setItem("realEstateClients", JSON.stringify(updatedClients));
      setNewClient({
        name: "",
        contact: "",
        language: "English",
        requirements: "",
        budget: "",
        locations: "",
        followUpDate: "",
        notes: ""
      });
    }
    setShowForm(false);
  };

  const editClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const deleteClient = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      const updatedClients = clients.filter(client => client.id !== id);
      setClients(updatedClients);
      localStorage.setItem("realEstateClients", JSON.stringify(updatedClients));
    }
  };

  const filteredClients = () => {
    return clients.filter(client => {
      const matchesText = 
        client.name.toLowerCase().includes(filter.toLowerCase()) ||
        client.requirements.toLowerCase().includes(filter.toLowerCase()) ||
        client.locations.toLowerCase().includes(filter.toLowerCase());
      
      const matchesLanguage = 
        languageFilter === "All" || 
        client.language === languageFilter;
      
      return matchesText && matchesLanguage;
    });
  };

  const clientsWithFollowUps = () => {
    const today = new Date().toISOString().split('T')[0];
    return filteredClients().filter(client => client.followUpDate && client.followUpDate >= today);
  };

  const clientsWithoutFollowUps = () => {
    const today = new Date().toISOString().split('T')[0];
    return filteredClients().filter(client => !client.followUpDate || client.followUpDate < today);
  };

  const languages = ["All", "English", "Hindi", "Marathi", "Telugu", "Tamil", "Kannada", "Bengali", "Mixed"];

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.content}>
        <h1 style={styles.title}>Client Manager</h1>
        
        <div style={styles.controls}>
          <div style={styles.searchFilters}>
            <input
              type="text"
              placeholder="Search clients, requirements or locations..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.searchInput}
            />
            
            <select 
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              style={styles.languageSelector}
            >
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            style={styles.addButton}
          >
            Add New Client
          </button>
        </div>
        
        {showForm && (
          <div style={styles.formOverlay}>
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>
                {editingClient ? "Edit Client" : "Add New Client"}
              </h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editingClient ? editingClient.name : newClient.name}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Information:</label>
                <input
                  type="text"
                  name="contact"
                  value={editingClient ? editingClient.contact : newClient.contact}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Language:</label>
                <select
                  name="language"
                  value={editingClient ? editingClient.language : newClient.language}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  {languages.filter(lang => lang !== "All").map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Property Requirements:</label>
                <textarea
                  name="requirements"
                  value={editingClient ? editingClient.requirements : newClient.requirements}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="E.g., 2BHK, sea-facing, new construction"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Budget Range:</label>
                <input
                  type="text"
                  name="budget"
                  value={editingClient ? editingClient.budget : newClient.budget}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="E.g., ₹50L - ₹75L"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Locations:</label>
                <input
                  type="text"
                  name="locations"
                  value={editingClient ? editingClient.locations : newClient.locations}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="E.g., Bandra, Andheri, Powai"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Follow-up Date:</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={editingClient ? editingClient.followUpDate : newClient.followUpDate}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Notes:</label>
                <textarea
                  name="notes"
                  value={editingClient ? editingClient.notes : newClient.notes}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Additional notes about the client"
                />
              </div>
              
              <div style={styles.formButtons}>
                <button 
                  onClick={saveClient}
                  style={styles.saveButton}
                >
                  {editingClient ? "Update Client" : "Save Client"}
                </button>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingClient(null);
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div style={styles.clientSections}>
          {clientsWithFollowUps().length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Upcoming Follow-ups</h2>
              <div style={styles.clientGrid}>
                {clientsWithFollowUps().map(client => (
                  <ClientCard 
                    key={client.id}
                    client={client}
                    onEdit={() => editClient(client)}
                    onDelete={() => deleteClient(client.id)}
                    highlight={new Date(client.followUpDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>All Clients</h2>
            {filteredClients().length === 0 ? (
              <p style={styles.emptyState}>No clients found. Add a new client to get started.</p>
            ) : (
              <div style={styles.clientGrid}>
                {clientsWithoutFollowUps().map(client => (
                  <ClientCard 
                    key={client.id}
                    client={client}
                    onEdit={() => editClient(client)}
                    onDelete={() => deleteClient(client.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientCard = ({ client, onEdit, onDelete, highlight }) => {
  const isFollowUpDue = highlight;
  
  return (
    <div style={{
      ...styles.clientCard,
      borderColor: isFollowUpDue ? '#f39c12' : '#ddd',
      backgroundColor: isFollowUpDue ? '#fff9e6' : 'white'
    }}>
      <div style={styles.clientCardHeader}>
        <h3 style={styles.clientName}>{client.name}</h3>
        <div style={styles.languageBadge}>{client.language}</div>
      </div>
      
      <div style={styles.clientDetails}>
        {client.contact && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Contact:</span>
            <span style={styles.detailValue}>{client.contact}</span>
          </div>
        )}
        
        {client.requirements && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Requirements:</span>
            <span style={styles.detailValue}>{client.requirements}</span>
          </div>
        )}
        
        {client.budget && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Budget:</span>
            <span style={styles.detailValue}>{client.budget}</span>
          </div>
        )}
        
        {client.locations && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Locations:</span>
            <span style={styles.detailValue}>{client.locations}</span>
          </div>
        )}
        
        {client.followUpDate && (
          <div style={{
            ...styles.detailRow,
            color: isFollowUpDue ? '#d35400' : 'inherit',
            fontWeight: isFollowUpDue ? 'bold' : 'normal'
          }}>
            <span style={styles.detailLabel}>Follow-up:</span>
            <span style={styles.detailValue}>
              {new Date(client.followUpDate).toLocaleDateString()}
              {isFollowUpDue && " (Today)"}
            </span>
          </div>
        )}
      </div>
      
      {client.notes && (
        <div style={styles.notes}>
          <p style={styles.notesText}>{client.notes}</p>
        </div>
      )}
      
      <div style={styles.clientCardActions}>
        <button onClick={onEdit} style={styles.editButton}>Edit</button>
        <button onClick={onDelete} style={styles.deleteButton}>Delete</button>
        <Link to="/live-chat" state={{ isAgent: true, clientName: client.name, clientLanguage: client.language }} style={styles.chatLink}>
          <button style={styles.chatButton}>Chat</button>
        </Link>
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
    backgroundImage: "url('/hpbg.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
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
    fontFamily: 'Sage, serif',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  searchFilters: {
    display: 'flex',
    gap: '15px',
    flex: 1,
    maxWidth: '70%',
  },
  searchInput: {
    flex: 1,
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
  },
  languageSelector: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
    minWidth: '150px',
  },
  addButton: {
    backgroundColor: '#B2AC88',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 5px rgba(178, 172, 136, 0.3)',
  },
  formOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  formTitle: {
    color: '#B2AC88',
    marginTop: 0,
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    fontFamily: 'Sage, serif',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
    minHeight: '80px',
    resize: 'vertical',
  },
  formButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  saveButton: {
    backgroundColor: '#B2AC88',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '1em',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(178, 172, 136, 0.3)',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    color: '#333',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '1em',
    cursor: 'pointer',
  },
  clientSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    color: '#B2AC88',
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '1.5em',
    fontFamily: 'Sage, serif',
  },
  emptyState: {
    textAlign: 'center',
    color: '#777',
    margin: '30px 0',
    fontSize: '1.1em',
  },
  clientGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  clientCard: {
    borderRadius: '10px',
    border: '1px solid #ddd',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  clientCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  clientName: {
    margin: 0,
    fontSize: '1.2em',
    color: '#2c3e50',
  },
  languageBadge: {
    backgroundColor: '#B2AC88',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '3px',
    fontSize: '0.8em',
  },
  clientDetails: {
    flex: 1,
  },
  detailRow: {
    display: 'flex',
    margin: '5px 0',
  },
  detailLabel: {
    fontWeight: 'bold',
    width: '100px',
    color: '#555',
  },
  detailValue: {
    flex: 1,
  },
  notes: {
    marginTop: '10px',
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '5px',
  },
  notesText: {
    margin: 0,
    fontSize: '0.9em',
    color: '#555',
  },
  clientCardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  editButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '3px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(52, 152, 219, 0.3)',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '3px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(231, 76, 60, 0.3)',
  },
  chatButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '3px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(39, 174, 96, 0.3)',
  },
  chatLink: {
    textDecoration: 'none',
  }
};

export default ClientManager;