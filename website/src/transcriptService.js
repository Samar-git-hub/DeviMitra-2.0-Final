// Function to generate a unique ID for conversations
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };
  
  // Create a new conversation record
  export const createConversationRecord = (clientName, clientLanguage, agentName, agentLanguages) => {
    return {
      id: generateId(),
      startTime: new Date().toISOString(),
      endTime: null,
      client: {
        name: clientName || "Unknown Client",
        preferredLanguage: clientLanguage || "Unknown"
      },
      agent: {
        name: agentName || "Agent",
        languages: agentLanguages || []
      },
      messages: [],
      keyRequirements: [],
      properties: []
    };
  };
  
  // Save conversation to localStorage
  export const saveTranscript = (conversationRecord, messages, keyPoints, propertyDetails) => {
    // Complete the record with end time and collected data
    const completeRecord = {
      ...conversationRecord,
      endTime: new Date().toISOString(),
      messages: messages,
      keyRequirements: keyPoints,
      properties: propertyDetails ? [propertyDetails] : []
    };
    
    // Save to localStorage
    const savedTranscripts = JSON.parse(localStorage.getItem("realEstateTranscripts") || "[]");
    savedTranscripts.push(completeRecord);
    localStorage.setItem("realEstateTranscripts", JSON.stringify(savedTranscripts));
    
    return completeRecord;
  };
  
  // Export transcript as a downloadable file
  export const exportTranscriptAsFile = (transcript) => {
    const jsonData = JSON.stringify(transcript, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${transcript.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Get all saved transcripts
  export const getSavedTranscripts = () => {
    return JSON.parse(localStorage.getItem("realEstateTranscripts") || "[]");
  };
  
  // Get a specific transcript by ID
  export const getTranscriptById = (id) => {
    const transcripts = getSavedTranscripts();
    return transcripts.find(transcript => transcript.id === id);
  };
  
  // Delete a transcript by ID
  export const deleteTranscript = (id) => {
    const transcripts = getSavedTranscripts();
    const filteredTranscripts = transcripts.filter(transcript => transcript.id !== id);
    localStorage.setItem("realEstateTranscripts", JSON.stringify(filteredTranscripts));
  };