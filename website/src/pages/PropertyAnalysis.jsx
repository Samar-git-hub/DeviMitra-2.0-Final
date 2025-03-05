import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/PropertyAnalysis.css";

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

  // Rest of your state and handlers...
  const amenitiesOptions = [
    "Lift", "Swimming Pool", "Gym", "Garden", "Parking", "Security", 
    "Power Backup", "Club House", "Children's Play Area", "Jogging Track"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity]
    });
  };

  const analyzeProperty = async () => {
    // Your existing code...
    setIsLoading(true);
    try {
      const prompt = `
        Provide a detailed property analysis:
        Property Type: ${formData.propertyType}
        Location: ${formData.location}
        Area: ${formData.area} sq.ft.
        Bedrooms: ${formData.bedrooms}
        Bathrooms: ${formData.bathrooms}
        Amenities: ${formData.amenities.join(', ')}
        Age: ${formData.age}
        Price: ${formData.price}
        Description: ${formData.description}
        
        Analysis should include:
        - Market comparison
        - Strengths & weaknesses
        - Target buyers
        - Marketing & negotiation tips
      `;
      
      const result = await generateAnswer(prompt);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing property:", error);
      setAnalysis("Error generating analysis. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // This is the direct style fix
  const navbarSpacerStyle = {
    height: "0px",  // Adjust this value as needed
    width: "100%"
  };

  return (
    <div className="page-container">
      <Navbar />
      {/* This empty div creates space after the navbar */}
      <div style={navbarSpacerStyle}></div>
      
      <main className="property-wrapper">
        <div className="property-container">
          <h1 className="property-title">Property Analysis</h1>
          
          <form onSubmit={(e) => { e.preventDefault(); analyzeProperty(); }} className="property-form">
            {/* Form content remains the same */}
            {/* ... */}
            
            <div className="form-group">
              <label htmlFor="propertyType">Property Type:</label>
              <select 
                id="propertyType"
                name="propertyType" 
                value={formData.propertyType} 
                onChange={handleInputChange}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input 
                type="text" 
                id="location"
                name="location" 
                value={formData.location} 
                onChange={handleInputChange} 
                required 
                placeholder="Enter location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">Area (sq.ft.):</label>
              <input 
                type="number" 
                id="area"
                name="area" 
                value={formData.area} 
                onChange={handleInputChange} 
                required 
                placeholder="Enter area in sq.ft."
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="bedrooms">Bedrooms:</label>
                <select 
                  id="bedrooms"
                  name="bedrooms" 
                  value={formData.bedrooms} 
                  onChange={handleInputChange}
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5+">5+ BHK</option>
                </select>
              </div>

              <div className="form-group half">
                <label htmlFor="bathrooms">Bathrooms:</label>
                <select 
                  id="bathrooms"
                  name="bathrooms" 
                  value={formData.bathrooms} 
                  onChange={handleInputChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Amenities:</label>
              <div className="amenities-container">
                {amenitiesOptions.map(amenity => (
                  <label key={amenity} className="amenity-label">
                    <input 
                      type="checkbox" 
                      checked={formData.amenities.includes(amenity)} 
                      onChange={() => handleAmenityToggle(amenity)} 
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="age">Age of Property:</label>
              <select 
                id="age"
                name="age" 
                value={formData.age} 
                onChange={handleInputChange}
              >
                <option value="new">New</option>
                <option value="<5">Less than 5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10-20">10-20 years</option>
                <option value=">20">More than 20 years</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹):</label>
              <input 
                type="text" 
                id="price"
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                required 
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea 
                id="description"
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows="4"
                placeholder="Enter property description"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="analyze-btn" 
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze Property"}
            </button>
          </form>

          {analysis && (
            <div className="analysis-output">
              <h2>Property Analysis Results</h2>
              <div className="analysis-content">
                {analysis}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PropertyAnalysis;