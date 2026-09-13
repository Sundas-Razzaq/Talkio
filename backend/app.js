import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authroutes.js";
import { errorHandler, notFound } from "./src/middleware/errormiddleware.js";
import userRoutes from "./src/routes/userRoutes.js";
import connectionRoutes from "./src/routes/connectionRoutes.js";
import conversationRoutes from "./src/routes/conversationRoutes.js";
const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/test-db", async (req, res) => {
    try {
        res.json({
            mongoUriExists: !!process.env.MONGO_URI,
            readyState: mongoose.connection.readyState, // 0=disconnected, 1=connected
            readyStateText: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown",
            host: mongoose.connection.host || null,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Talkio Backend Running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/conversations", conversationRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;