import React, { useState, useRef, useEffect } from "react";
import "../styles/App.css";
import "../styles/ChatWindow.css";
import { Link } from "react-router-dom";

const PropertyAnalysis = ({ generateAnswer }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: "apartment",
    location: "",
    area: "",
    bedrooms: "2",
    bathrooms: "2",
    amenities: [],
    age: "new",
    price: "",
    description: ""
  });

  const amenitiesOptions = [
    "Lift",
    "Swimming Pool",
    "Gym",
    "Garden",
    "Parking",
    "Security",
    "Power Backup",
    "Club House",
    "Children's Play Area",
    "Jogging Track"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAmenityToggle = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };

  const analyzeProperty = async () => {
    setIsLoading(true);
    
    try {
      // Create a detailed prompt for property analysis
      const prompt = `
        Provide a detailed property analysis for this real estate agent:
        
        Property Details:
        - Type: ${formData.propertyType}
        - Location: ${formData.location}
        - Area: ${formData.area} sq.ft.
        - Bedrooms: ${formData.bedrooms}
        - Bathrooms: ${formData.bathrooms}
        - Amenities: ${formData.amenities.join(', ')}
        - Age: ${formData.age}
        - Asking Price: ${formData.price}
        - Description: ${formData.description}
        
        Please provide a comprehensive analysis including:
        1. Market value assessment and price comparison with similar properties
        2. Strengths and unique selling points
        3. Potential challenges or concerns
        4. Target buyer profiles (demographics, language preferences, etc.)
        5. Suggested marketing approach
        6. Negotiation strategy recommendations
        
        Format your response with clear headings and bullet points where appropriate.
      `;
      
      const result = await generateAnswer(prompt);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing property:", error);
      setAnalysis("Error generating property analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeProperty();
  };

  const translateAnalysis = async (targetLanguage) => {
    if (!analysis) return;
    
    setIsLoading(true);
    try {
      // Create a translation prompt
      const prompt = `
        Translate the following property analysis to ${targetLanguage}. Maintain the formatting and structure:
        
        ${analysis}
      `;
      
      const translatedResult = await generateAnswer(prompt);
      setAnalysis(translatedResult);
    } catch (error) {
      console.error("Error translating analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      propertyType: "apartment",
      location: "",
      area: "",
      bedrooms: "2",
      bathrooms: "2",
      amenities: [],
      age: "new",
      price: "",
      description: ""
    });
    setAnalysis(null);
  };

  return (
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
      <br></br>
      
      <div style={styles.mainContent}>
        <h1 style={styles.title}>Property Analysis</h1>
        
        <div style={styles.contentContainer}>
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Property Type</label>
                <select 
                  name="propertyType" 
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Bandra West, Mumbai"
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Area (sq.ft.)</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., 1200"
                    style={styles.input}
                    required
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Bedrooms</label>
                  <select 
                    name="bedrooms" 
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5+">5+ BHK</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Bathrooms</label>
                  <select 
                    name="bathrooms" 
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Amenities</label>
                <div style={styles.amenitiesContainer}>
                  {amenitiesOptions.map(amenity => (
                    <div key={amenity} style={styles.amenityOption}>
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        style={styles.checkbox}
                      />
                      <label htmlFor={`amenity-${amenity}`} style={styles.checkboxLabel}>
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Property Age</label>
                  <select 
                    name="age" 
                    value={formData.age}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="new">New Construction</option>
                    <option value="<5">Less than 5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10-20">10-20 years</option>
                    <option value=">20">More than 20 years</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Asking Price (₹)</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 1.5 Cr or 75 Lakh"
                    style={styles.input}
                    required
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Property Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide additional details about the property..."
                  style={styles.textarea}
                  rows="4"
                />
              </div>
              
              <div style={styles.formActions}>
                <button type="submit" style={styles.submitButton} disabled={isLoading}>
                  {isLoading ? "Analyzing..." : "Analyze Property"}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm} 
                  style={styles.resetButton}
                  disabled={isLoading}
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
          
          {(analysis || isLoading) && (
            <div style={styles.analysisContainer}>
              <div style={styles.analysisHeader}>
                <h2 style={styles.analysisTitle}>Property Analysis</h2>
                <div style={styles.translateOptions}>
                  <span style={styles.translateLabel}>Translate to:</span>
                  <button 
                    onClick={() => translateAnalysis("Hindi")} 
                    style={styles.translateButton}
                    disabled={isLoading}
                  >
                    Hindi
                  </button>
                  <button 
                    onClick={() => translateAnalysis("Marathi")} 
                    style={styles.translateButton}
                    disabled={isLoading}
                  >
                    Marathi
                  </button>
                  <button 
                    onClick={() => translateAnalysis("Telugu")} 
                    style={styles.translateButton}
                    disabled={isLoading}
                  >
                    Telugu
                  </button>
                  <button 
                    onClick={() => translateAnalysis("English")} 
                    style={styles.translateButton}
                    disabled={isLoading}
                  >
                    English
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinner}></div>
                  <p style={styles.loadingText}>Generating comprehensive analysis...</p>
                </div>
              ) : (
                <div style={styles.analysisContent}>
                  <pre style={styles.analysisText}>{analysis}</pre>
                </div>
              )}
            </div>
          )}
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
  mainContent: {
    paddingTop: '120px', // Increased to ensure no overlap
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5em',
    color: '#B2AC88',
    textAlign: 'center',
    marginBottom: '30px',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    marginBottom: '50px',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '1em',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#2c3e50',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
    backgroundColor: 'white',
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
    resize: 'vertical',
  },
  amenitiesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
  },
  amenityOption: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '5px',
  },
  checkboxLabel: {
    fontSize: '0.9em',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  submitButton: {
    backgroundColor: '#B2AC88',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '12px 25px',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  resetButton: {
    backgroundColor: '#f1f1f1',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    padding: '12px 25px',
    fontSize: '1em',
    cursor: 'pointer',
  },
  analysisContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  analysisHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  },
  analysisTitle: {
    fontSize: '1.8em',
    color: '#B2AC88',
    margin: 0,
  },
  translateOptions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  translateLabel: {
    fontSize: '0.9em',
    color: '#555',
  },
  translateButton: {
    padding: '5px 10px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ddd',
    borderRadius: '3px',
    fontSize: '0.9em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #B2AC88',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '15px',
    color: '#555',
  },
  analysisContent: {
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
  analysisText: {
    fontFamily: 'inherit',
    whiteSpace: 'pre-wrap',
    margin: 0,
    lineHeight: '1.6',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
};

export default PropertyAnalysis;