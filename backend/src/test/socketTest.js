import { io } from "socket.io-client";

const TOKEN = "PASTE_YOUR_JWT_TOKEN_HERE";

const socket = io("http://localhost:5000", {
    auth: {
        token: TOKEN,
    },
});

socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
    console.log("Socket ID:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection failed:", error.message);
});

socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
});