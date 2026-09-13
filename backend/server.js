import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./src/config/db.js";
import socketHandler from "./src/socket/socketHandler.js";

dotenv.config();

// Connect DB
await connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  },
  path: "/socket.io",
});

socketHandler(io);

export default server;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}