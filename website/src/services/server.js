import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(join(__dirname, '../../public')));

// Store active users
const activeUsers = {
  clients: {},  // username -> socket.id
  agents: {},   // username -> socket.id
  waitingClients: [],
  clientToAgent: {},  // client username -> agent username
  agentToClient: {},  // agent username -> [client usernames]
  userLanguages: {}   // username -> preferred language
};

// Simple language detection
function detectLanguageSimple(text) {
  // Check for Hindi characters (Devanagari)
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  
  // Default to English
  return "English";
}

// Simulate translation for testing
function simulateTranslation(text, targetLanguage) {
  if (targetLanguage === "English") {
    if (text.match(/[\u0900-\u097F]/)) {  // Hindi characters
      // Sample Hindi -> English translations
      if (text.includes("नमस्ते")) return "Hello";
      if (text.includes("कैसे हो")) return "How are you";
      if (text.includes("धन्यवाद")) return "Thank you";
      return "This is a translation from Hindi to English";
    }
  } else if (targetLanguage === "Hindi") {
    if (!/[\u0900-\u097F]/.test(text)) {  // Not Hindi
      // Sample English -> Hindi translations
      if (text.toLowerCase().includes("hello")) return "नमस्ते";
      if (text.toLowerCase().includes("how are you")) return "आप कैसे हैं";
      if (text.toLowerCase().includes("thank you")) return "धन्यवाद";
      return "यह अंग्रेजी से हिंदी का अनुवाद है";
    }
  }
  
  return `[Translation to ${targetLanguage}: ${text}]`;
}

// Socket.io connection handling
io.on("connection", function (socket) {
  console.log("A user connected:", socket.id);

  // User joins chat
  socket.on("newuser", function (userData) {
    // Handle string or object input for backward compatibility
    const username = typeof userData === 'string' ? userData : userData.username;
    const userType = typeof userData === 'string' ? "client" : (userData.userType || "client");
    const preferredLanguage = typeof userData === 'string' ? "English" : (userData.preferredLanguage || "English");
    
    console.log(`User ${username} joined as ${userType}, preferred language: ${preferredLanguage}`);
    
    // Store user data in socket object
    socket.username = username;
    socket.userType = userType;
    socket.preferredLanguage = preferredLanguage;
    
    // Store user's preferred language
    activeUsers.userLanguages[username] = preferredLanguage;
    
    // Register user based on type
    if (userType === "agent") {
      activeUsers.agents[username] = socket.id;
      activeUsers.agentToClient[username] = [];
      
      // Notify about waiting clients if any
      activeUsers.waitingClients.forEach(clientUsername => {
        socket.emit("client_waiting", {
          username: clientUsername,
          preferredLanguage: activeUsers.userLanguages[clientUsername] || "Unknown"
        });
      });
    } else {
      activeUsers.clients[username] = socket.id;
      
      // Add to waiting clients list
      activeUsers.waitingClients.push(username);
      
      // Notify all agents about the new waiting client
      Object.keys(activeUsers.agents).forEach(agentUsername => {
        const agentSocketId = activeUsers.agents[agentUsername];
        const agentSocket = io.sockets.sockets.get(agentSocketId);
        
        if (agentSocket) {
          agentSocket.emit("client_waiting", {
            username: username,
            preferredLanguage: preferredLanguage
          });
        }
      });
    }
    
    // Notify everyone about the new user
    const updateMessage = typeof userData === 'string' 
      ? `${username} joined the conversation` 
      : `${username} joined the conversation as a ${userType}`;
    
    socket.broadcast.emit("update", {
      message: updateMessage,
      userType: userType
    });
  });

  // Handle chat messages
  socket.on("chat", function (message) {
    try {
      // Handle flat message format (backward compatibility)
      const username = message.username;
      const userType = message.userType || socket.userType || "client";
      const text = message.text;
      
      console.log(`Received message from ${username} (${userType}): ${text.slice(0, 30)}...`);
      
      // Detect the language of the message
      const detectedLanguage = detectLanguageSimple(text);
      console.log(`Detected language: ${detectedLanguage}`);
      
      // Store the original message and detected language
      const enhancedMessage = {
        ...message,
        detectedLanguage: detectedLanguage
      };
      
      // If client is assigned to an agent, send only to that agent
      if (userType === "client" && activeUsers.clientToAgent[username]) {
        const agentUsername = activeUsers.clientToAgent[username];
        const agentSocketId = activeUsers.agents[agentUsername];
        
        if (agentSocketId) {
          const agentSocket = io.sockets.sockets.get(agentSocketId);
          if (agentSocket) {
            console.log(`Sending message to agent ${agentUsername}`);
            agentSocket.emit("chat", enhancedMessage);
          }
        }
      } 
      // If agent is assigned to clients, send only to those clients
      else if (userType === "agent" && activeUsers.agentToClient[username]) {
        activeUsers.agentToClient[username].forEach(clientUsername => {
          const clientSocketId = activeUsers.clients[clientUsername];
          
          if (clientSocketId) {
            const clientSocket = io.sockets.sockets.get(clientSocketId);
            if (clientSocket) {
              console.log(`Sending message to client ${clientUsername}`);
              clientSocket.emit("chat", enhancedMessage);
            }
          }
        });
      } 
      // Default: broadcast to all (for testing/demo purposes)
      else {
        console.log("Broadcasting message to all users");
        socket.broadcast.emit("chat", enhancedMessage);
      }
    } catch (error) {
      console.error("Error processing chat message:", error);
      // Send original message without language detection if error occurs
      socket.broadcast.emit("chat", message);
    }
  });

  // Agent accepts client
  socket.on("accept_client", function(data) {
    const agentUsername = data.agentUsername;
    const clientUsername = data.clientUsername;
    
    console.log(`Agent ${agentUsername} accepted client ${clientUsername}`);
    
    // Assign client to agent
    activeUsers.clientToAgent[clientUsername] = agentUsername;
    
    if (!activeUsers.agentToClient[agentUsername]) {
      activeUsers.agentToClient[agentUsername] = [];
    }
    activeUsers.agentToClient[agentUsername].push(clientUsername);
    
    // Remove client from waiting list
    const waitingIndex = activeUsers.waitingClients.indexOf(clientUsername);
    if (waitingIndex !== -1) {
      activeUsers.waitingClients.splice(waitingIndex, 1);
    }
    
    // Notify client
    const clientSocketId = activeUsers.clients[clientUsername];
    if (clientSocketId) {
      const clientSocket = io.sockets.sockets.get(clientSocketId);
      if (clientSocket) {
        clientSocket.emit("agent_assigned", {
          agentUsername: agentUsername
        });
      }
    }
    
    // Notify agent
    socket.emit("update", {
      message: `You are now connected with client ${clientUsername}.`
    });
  });

  // Handle translation requests
  socket.on("translate", function (data) {
    try {
      console.log(`Translation request: "${data.text}" to ${data.targetLanguage}`);
      const translation = simulateTranslation(data.text, data.targetLanguage);
      
      socket.emit("translation", {
        originalText: data.text,
        translation: translation,
        targetLanguage: data.targetLanguage
      });
      
    } catch (error) {
      console.error("Error translating message:", error);
      socket.emit("translation_error", { error: "Translation failed" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", function () {
    console.log("A user disconnected:", socket.id);
    
    // Clean up user data if they didn't properly exit
    if (socket.username) {
      const username = socket.username;
      const userType = socket.userType || "client";
      
      console.log(`User ${username} disconnected`);
      
      // Handle cleanup based on user type
      if (userType === "agent") {
        delete activeUsers.agents[username];
        delete activeUsers.agentToClient[username];
      } else {
        delete activeUsers.clients[username];
        
        // Remove from waiting list
        const waitingIndex = activeUsers.waitingClients.indexOf(username);
        if (waitingIndex !== -1) {
          activeUsers.waitingClients.splice(waitingIndex, 1);
        }
        
        delete activeUsers.clientToAgent[username];
      }
      
      delete activeUsers.userLanguages[username];
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Socket.io is ready for connections`);
});