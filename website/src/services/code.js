(function () {
    const app = document.querySelector(".app");
    const socket = io("http://localhost:3000");

    let uname;
    let userType = "client"; // Default as client
    let preferredLanguage = "English"; // Default language
    
    // Add language selector to the UI
    function setupLanguageSelector() {
        const languageSelector = document.createElement("div");
        languageSelector.className = "language-selector";
        
        const languages = ["English", "Hindi", "Marathi", "Telugu", "Tamil", "Kannada", "Bengali"];
        
        let selectorHTML = `
            <label>Language: </label>
            <select id="language-select">
        `;
        
        languages.forEach(lang => {
            selectorHTML += `<option value="${lang}">${lang}</option>`;
        });
        
        selectorHTML += `</select>`;
        languageSelector.innerHTML = selectorHTML;
        
        // Insert before the exit button
        const header = app.querySelector(".chat-screen .header");
        const exitBtn = app.querySelector("#exit-chat");
        header.insertBefore(languageSelector, exitBtn);
        
        // Add event listener for language change
        app.querySelector("#language-select").addEventListener("change", function() {
            preferredLanguage = this.value;
            socket.emit("update_language", preferredLanguage);
            
            const updateMessage = `You changed your preferred language to ${preferredLanguage}`;
            renderMessage("update", updateMessage);
        });
    }
    
    // Add user type selection to join screen
    function setupUserTypeSelection() {
        const userTypeContainer = document.createElement("div");
        userTypeContainer.className = "form-input";
        userTypeContainer.innerHTML = `
            <label>I am a:</label>
            <div class="user-type-options">
                <label>
                    <input type="radio" name="user-type" value="client" checked> Client
                </label>
                <label>
                    <input type="radio" name="user-type" value="agent"> Agent
                </label>
            </div>
        `;
        
        // Insert before join button
        const joinBtn = app.querySelector(".join-screen .form-input:last-child");
        const joinForm = app.querySelector(".join-screen .form");
        joinForm.insertBefore(userTypeContainer, joinBtn);
        
        // Add event listeners for user type selection
        const userTypeRadios = document.querySelectorAll('input[name="user-type"]');
        userTypeRadios.forEach(radio => {
            radio.addEventListener("change", function() {
                userType = this.value;
            });
        });
    }

    // Setup UI elements
    setupUserTypeSelection();
    setupLanguageSelector();

    // Join button event
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return;
        }
        
        // Emit new user event with additional details
        socket.emit("newuser", {
            username: username,
            userType: userType,
            preferredLanguage: preferredLanguage
        });
        
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
        
        // Show a welcome message based on user type
        if (userType === "client") {
            renderMessage("update", `Welcome ${username}! You've joined as a client. An agent will assist you shortly.`);
        } else {
            renderMessage("update", `Welcome ${username}! You've joined as an agent. You can now assist clients.`);
        }
    });

    // Send message event
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        sendMessage();
    });
    
    // Send message on Enter key
    app.querySelector(".chat-screen #message-input").addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
    
    function sendMessage() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }
        
        // Add the message to UI
        renderMessage("my", {
            username: uname,
            text: message
        });
        
        // Emit chat event with additional metadata
        socket.emit("chat", {
            username: uname,
            text: message,
            userType: userType,
            timestamp: new Date().toISOString()
        });
        
        app.querySelector(".chat-screen #message-input").value = "";
    }

    // Exit chat event
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", {
            username: uname,
            userType: userType
        });
        window.location.href = window.location.href;
    });
    
    // Socket event handlers
    socket.on("update", function (update) {
        renderMessage("update", update.message || update);
    });

    socket.on("chat", function (message) {
        // Add display for detected language if available
        renderMessage("other", message);
        
        // Request translation if language is different and detected
        if (message.detectedLanguage && message.detectedLanguage !== preferredLanguage) {
            socket.emit("translate", {
                text: message.text,
                targetLanguage: preferredLanguage
            });
        }
    });
    
    socket.on("translation", function(data) {
        // Find the message that needs translation
        const messages = app.querySelectorAll(".message.other-message");
        for (let i = messages.length - 1; i >= 0; i--) {
            const textDiv = messages[i].querySelector(".text");
            if (textDiv && textDiv.textContent.trim() === data.originalText.trim()) {
                // Add translation
                if (!messages[i].querySelector(".translation")) {
                    const translationDiv = document.createElement("div");
                    translationDiv.className = "translation";
                    translationDiv.textContent = data.translation;
                    messages[i].querySelector("div").appendChild(translationDiv);
                }
                break;
            }
        }
    });
    
    socket.on("client_waiting", function(data) {
        if (userType === "agent") {
            const notification = `Client ${data.username} is waiting for assistance. They speak ${data.preferredLanguage}.`;
            renderMessage("update", notification);
            
            // Add option to accept client
            const messageContainer = app.querySelector(".chat-screen .messages");
            const acceptDiv = document.createElement("div");
            acceptDiv.className = "client-request";
            acceptDiv.innerHTML = `
                <p>Would you like to help this client?</p>
                <button class="accept-client" data-client="${data.username}">Accept Client</button>
            `;
            messageContainer.appendChild(acceptDiv);
            
            // Add event listener for accept button
            acceptDiv.querySelector(".accept-client").addEventListener("click", function() {
                const clientUsername = this.getAttribute("data-client");
                socket.emit("accept_client", {
                    agentUsername: uname,
                    clientUsername: clientUsername
                });
                
                // Remove the accept option
                acceptDiv.remove();
                
                renderMessage("update", `You are now chatting with ${clientUsername}.`);
            });
        }
    });
    
    socket.on("agent_assigned", function(data) {
        if (userType === "client") {
            renderMessage("update", `Agent ${data.agentUsername} has been assigned to help you.`);
        }
    });

    // Enhanced message rendering function
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            
            let messageHTML = `
                <div>
                    <div class="name">You${userType === "agent" ? " (Agent)" : ""}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            
            el.innerHTML = messageHTML;
            messageContainer.appendChild(el);
        } else if (type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            
            let messageHTML = `
                <div>
                    <div class="name">${message.username}${message.userType === "agent" ? " (Agent)" : ""}</div>
                    <div class="text">${message.text}</div>
            `;
            
            // Add language tag if available
            if (message.detectedLanguage) {
                messageHTML += `<div class="language-tag">${message.detectedLanguage}</div>`;
            }
            
            // Add timestamp if available
            if (message.timestamp) {
                const time = new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                messageHTML += `<div class="timestamp">${time}</div>`;
            }
            
            messageHTML += `</div>`;
            el.innerHTML = messageHTML;
            messageContainer.appendChild(el);
        } else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        
        // Scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();