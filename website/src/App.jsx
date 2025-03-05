import { useState, useEffect } from 'react';
import './styles/App.css';
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ChatWindow from './pages/ChatWindow';
import Features from './pages/features';
import ClientManager from './pages/ClientManager';
import Contact from './pages/contact';
import Resource from './pages/resource';
import About from './pages/about';
import PropertyAnalysis from './pages/PropertyAnalysis';
import TranscriptViewer from './pages/TranscriptViewer';
import UserTypeSelection from './pages/UserTypeSelection';
import WaitingRoom from './pages/WaitingRoom';
import AgentDashboard from './pages/AgentDashboard';
import LiveChat from './pages/LiveChat';

// Services for translation and transcript handling
import { detectLanguage, translateText, simulateTranslation } from './translationService';

function App() {
  const [context, setContext] = useState("");

  useEffect(() => {
    fetch('/content.txt')
      .then(response => response.text())
      .then(data => setContext(data))
      .catch(error => console.error('Error loading content:', error));
  }, []);

  const generateAnswer = async (question, targetLanguage = "english") => {
    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        throw new Error("API key is undefined. Make sure to set VITE_GEMINI_API_KEY in your .env file");
      }

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        method: "post",
        data: {
          "contents": [{
            "parts":[{"text": `Context: ${context}\n\nProcess this query and respond in ${targetLanguage}: ${question}`}]
          }]
        }
      });
      
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error generating answer:", error);
      return "Sorry, there was an error processing your request.";
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/features" element={<Features />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/chatwindow" element={
            <ChatWindow 
              generateAnswer={generateAnswer} 
              detectLanguage={detectLanguage}
              translateText={translateText}
            />
          } />
          <Route path="/clientmanager" element={<ClientManager />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resource" element={<Resource />} />
          <Route path="/about" element={<About />} />
          <Route path="/usertypeselection" element={<UserTypeSelection/>} />
          <Route path="/waiting-room" element={<WaitingRoom/>} />
          <Route path="/live-chat" element={
            <LiveChat 
              generateAnswer={generateAnswer}
              detectLanguage={detectLanguage}
              translateText={translateText}
            />
          } />
          <Route path="/agent-dashboard" element={<AgentDashboard/>} />
          <Route path="/property-analysis" element={<PropertyAnalysis generateAnswer={generateAnswer} />} />
          <Route path="/transcript-viewer" element={<TranscriptViewer />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;