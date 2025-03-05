const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public"))); // Fixed path joining

io.on("connection", function (socket) {
    console.log("A user connected");

    socket.on("newuser", function (username) {
        socket.broadcast.emit("update", username + " joined the conversation");
    });

    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", username + " left the conversation");
    });

    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);
    });

    socket.on("disconnect", function () {
        console.log("A user disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
