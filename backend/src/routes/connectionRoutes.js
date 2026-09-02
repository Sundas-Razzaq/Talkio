import express from "express";
import {
    sendFriendRequest,
    getPendingRequests,
    respondToFriendRequest,
    getFriends,
    removeFriend,
    inviteUserByEmail,
} from "../controllers/connectionController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/request", authMiddleware, sendFriendRequest);
router.get("/requests", authMiddleware, getPendingRequests);
router.get("/friends", authMiddleware, getFriends);
router.patch("/request/:connectionId", authMiddleware, respondToFriendRequest);
router.delete("/friends/:friendId", authMiddleware, removeFriend);
router.post("/invite", authMiddleware, inviteUserByEmail);

export default router;