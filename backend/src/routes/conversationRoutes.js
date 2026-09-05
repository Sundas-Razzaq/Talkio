import express from "express";

import {
    getOrCreateConversation,
    getConversations,
    getMessages,
} from "../controllers/conversationController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
    "/with/:friendId",
    authMiddleware,
    getOrCreateConversation
);

router.get(
    "/",
    authMiddleware,
    getConversations
);

router.get(
    "/:conversationId/messages",
    authMiddleware,
    getMessages
);

export default router;