import axios from 'axios';

// Extract key points from conversation using Gemini
export const extractRequirementsWithGemini = async (messages, isClient = true) => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("API key is undefined");
    }
    
    // Filter for client messages
    const clientMessages = messages.filter(msg => 
      isClient ? msg.user === "You" : msg.user === "Client"
    );
    
    if (clientMessages.length === 0) {
      return [];
    }
    
    // Create a conversation string from the messages
    const conversationText = clientMessages.map(msg => {
      return `${msg.user}: ${msg.text}${msg.translation ? ` (Translation: ${msg.translation})` : ''}`;
    }).join("\n");
    
    // Create the prompt for Gemini
    const prompt = `
      Extract the following client requirements from this real estate conversation:
      - Budget range
      - Preferred locations/areas
      - Property type (e.g., apartment, house, villa)
      - Size (e.g., 2BHK, 3BHK)
      - Special requirements (e.g., parking, garden, gym)
      
      Format each requirement on a new line with the category and value.
      Only include information explicitly mentioned in the conversation.
      If a category is not mentioned, don't include it.
      
      Conversation:
      ${conversationText}
    `;
    
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      method: "post",
      data: {
        "contents": [{
          "parts":[{"text": prompt}]
        }]
      }
    });
    
    const result = response.data.candidates[0].content.parts[0].text;
    
    // Parse the results into an array of strings
    const requirements = result.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('-') && line.includes(':'));
    
    return requirements;
  } catch (error) {
    console.error("Error extracting requirements:", error);
    return [];
  }
};

// Simple requirements extraction when API is not available
export const extractRequirementsSimple = (messages, isClient = true) => {
  // Filter for client messages
  const clientMessages = messages.filter(msg => 
    isClient ? msg.user === "You" : msg.user === "Client"
  );
  
  const keyPointsMap = {
    budget: null,
    location: null,
    propertyType: null,
    bedrooms: null,
    otherRequirements: []
  };
  
  // Simple keyword extraction
  clientMessages.forEach(msg => {
    const text = msg.translation || msg.text;
    
    if (/budget|price|cost|लाख|करोड़|₹/.test(text.toLowerCase())) {
      keyPointsMap.budget = "₹75-90 Lakhs"; // Simulated extraction
    }
    
    if (/location|area|andheri|bandra|borivali|powai|माल|लोकेशन|location|area/.test(text.toLowerCase())) {
      keyPointsMap.location = "Andheri, Bandra"; // Simulated extraction
    }
    
    if (/bhk|bedroom|apartment|flat|अपार्टमेंट|फ्लैट/.test(text.toLowerCase())) {
      keyPointsMap.propertyType = "Apartment";
      keyPointsMap.bedrooms = "2BHK"; // Simulated extraction
    }
    
    if (/parking|garden|balcony|terrace|gym|swimming|पार्किंग|गार्डन|बालकनी/.test(text.toLowerCase())) {
      keyPointsMap.otherRequirements.push("Parking, Garden");
    }
  });
  
  // Convert to array of points
  const points = [];
  if (keyPointsMap.budget) points.push(`Budget: ${keyPointsMap.budget}`);
  if (keyPointsMap.location) points.push(`Location: ${keyPointsMap.location}`);
  if (keyPointsMap.propertyType) points.push(`Property Type: ${keyPointsMap.propertyType}`);
  if (keyPointsMap.bedrooms) points.push(`Size: ${keyPointsMap.bedrooms}`);
  if (keyPointsMap.otherRequirements.length > 0) {
    points.push(`Requirements: ${keyPointsMap.otherRequirements.join(", ")}`);
  }
  
  return points;
};