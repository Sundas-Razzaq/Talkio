import express from "express";
import {
    sendFriendRequest,
    getPendingRequests,
} from "../controllers/connectionController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/request", authMiddleware, sendFriendRequest);
router.get("/requests", authMiddleware, getPendingRequests);

export default router;