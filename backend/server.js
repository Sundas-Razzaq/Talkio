import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./src/config/db.js";
import socketHandler from "./src/socket/socketHandler.js";

dotenv.config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin:
            process.env.FRONTEND_URL ||
            "http://localhost:5173",
        credentials: true,
    },
});

// Socket.IO handlers
socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});