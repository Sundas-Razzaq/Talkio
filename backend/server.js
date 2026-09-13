import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./src/config/db.js";
import socketHandler from "./src/socket/socketHandler.js";

dotenv.config();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://talkio-chat-cctyhkaa8-sundas-razzaq.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
  },
  path: "/socket.io",
});

socketHandler(io);

// Export for Vercel
export default server;

// Only listen locally
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}