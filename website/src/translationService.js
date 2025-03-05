import axios from 'axios';

// Language detection using Gemini API
export const detectLanguage = async (text) => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("API key is undefined");
    }

    const prompt = `Detect the language of this text and respond with ONLY the language name (Hindi, English, Marathi, Telugu, etc.): "${text}"`;
    
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      method: "post",
      data: {
        "contents": [{
          "parts":[{"text": prompt}]
        }]
      }
    });
    
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Language detection error:", error);
    return "Unknown";
  }
};

// Translation using Gemini API
export const translateText = async (text, targetLanguage) => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("API key is undefined");
    }

    const prompt = `Translate the following text to ${targetLanguage}. Provide only the translation:
    "${text}"`;
    
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      method: "post",
      data: {
        "contents": [{
          "parts":[{"text": prompt}]
        }]
      }
    });
    
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text if translation fails
  }
};

// Simulate translations for development (when API is not available)
export const simulateTranslation = (text, targetLanguage) => {
  const translations = {
    "Hindi": {
      "Hello": "नमस्ते",
      "How are you?": "आप कैसे हैं?",
      "I need a 2BHK apartment": "मुझे 2BHK अपार्टमेंट चाहिए",
      "What is the price?": "कीमत क्या है?",
      "Can we meet tomorrow?": "क्या हम कल मिल सकते हैं?"
    },
    "English": {
      "नमस्ते": "Hello",
      "आप कैसे हैं?": "How are you?",
      "मुझे 2BHK अपार्टमेंट चाहिए": "I need a 2BHK apartment",
      "कीमत क्या है?": "What is the price?",
      "क्या हम कल मिल सकते हैं?": "Can we meet tomorrow?"
    }
  };
  
  // Return pre-defined translation or original text
  if (translations[targetLanguage] && translations[targetLanguage][text]) {
    return translations[targetLanguage][text];
  }
  
  // For development purposes, just add a prefix for unknown texts
  return `[Translated to ${targetLanguage}]: ${text}`;
};