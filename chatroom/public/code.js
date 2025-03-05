(function () {
    const app = document.querySelector(".app");
    const socket = io();
    let uname;

    const joinScreen = app.querySelector(".join-screen");
    const chatScreen = app.querySelector(".chat-screen");
    const usernameInput = joinScreen.querySelector("#username");
    const messageInput = chatScreen.querySelector("#message-input");
    const messagesContainer = chatScreen.querySelector(".messages");

    // Validate username
    function validateUsername(username) {
        return username.trim().length > 0 && username.trim().length <= 20;
    }

    // Join Chat Event
    joinScreen.querySelector("#join-user").addEventListener("click", function () {
        const username = usernameInput.value.trim();

        if (!validateUsername(username)) {
            alert("Please enter a valid username (1-20 characters)");
            return;
        }

        socket.emit("newuser", username);
        uname = username;
        joinScreen.classList.remove("active");
        chatScreen.classList.add("active");
        messageInput.focus();
    });

    // Send Message Event
    chatScreen.querySelector("#send-message").addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();

        if (message.length === 0) return;

        renderMessage("my", {
            username: uname,
            text: message
        });

        socket.emit("chat", {
            username: uname,
            text: message
        });

        messageInput.value = "";
        scrollToBottom();
    }

    // Exit Chat Event
    chatScreen.querySelector("#exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        window.location.reload();
    });

    // Socket Event Listeners
    socket.on("update", function (update) {
        renderMessage("update", update);
        scrollToBottom();
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
        scrollToBottom();
    });

    // Render Message Function
    function renderMessage(type, message) {
        const el = document.createElement("div");

        switch (type) {
            case "my":
                el.classList.add("message", "my-message");
                el.innerHTML = `
                    <div>
                        <div class="name">You</div>
                        <div class="text">${escapeHTML(message.text)}</div>
                    </div>
                `;
                break;
            case "other":
                el.classList.add("message", "other-message");
                el.innerHTML = `
                    <div>
                        <div class="name">${escapeHTML(message.username)}</div>
                        <div class="text">${escapeHTML(message.text)}</div>
                    </div>
                `;
                break;
            case "update":
                el.classList.add("update");
                el.textContent = message;
                break;
        }

        messagesContainer.appendChild(el);
    }

    // Scroll to Bottom Function
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // HTML Escape Function
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag));
    }
})();
