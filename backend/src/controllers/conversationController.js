import Conversation from "../models/conversation.js";
import Connection from "../models/connection.js";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Message from "../models/message.js";

const createParticipantKey = (userId1, userId2) => {
    return [userId1.toString(), userId2.toString()]
        .sort()
        .join("_");
};

// Create a new conversation or get an existing one between two users
export const getOrCreateConversation = asyncHandler(
    async (req, res, next) => {
        const { friendId } = req.params;
        const userId = req.user._id;

        if (friendId === userId.toString()) {
            return next(
                new ApiError(
                    400,
                    "You cannot start a conversation with yourself"
                )
            );
        }

        const friend = await User.findById(friendId);

        if (!friend) {
            return next(new ApiError(404, "User not found"));
        }

        const connection = await Connection.findOne({
            status: "accepted",
            $or: [
                {
                    requester: userId,
                    recipient: friendId,
                },
                {
                    requester: friendId,
                    recipient: userId,
                },
            ],
        });

        if (!connection) {
            return next(
                new ApiError(
                    403,
                    "You can only start a conversation with a friend"
                )
            );
        }

        const participantKey = createParticipantKey(
            userId,
            friendId
        );

        let conversation = await Conversation.findOne({
            participantKey,
        }).populate(
            "participants",
            "name email profilePicture bio"
        );

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [userId, friendId],
                participantKey,
            });

            conversation = await Conversation.findById(
                conversation._id
            ).populate(
                "participants",
                "name email profilePicture bio"
            );
        }

        return res.status(200).json({
            success: true,
            conversation,
        });
    }
);

// Get all conversations for the current user
export const getConversations = asyncHandler(
    async (req, res) => {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
        })
            .populate(
                "participants",
                "name email profilePicture bio"
            )
            .populate(
                "lastMessage",
                "sender content createdAt"
            )
            .sort({
                lastMessageAt: -1,
                updatedAt: -1,
            });

        return res.status(200).json({
            success: true,
            conversations,
        });
    }
);

// Get all messages in a conversation
export const getMessages = asyncHandler(
    async (req, res, next) => {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId,
        });

        if (!conversation) {
            return next(
                new ApiError(
                    404,
                    "Conversation not found"
                )
            );
        }

        const messages = await Message.find({
            conversation: conversationId,
        })
            .populate(
                "sender",
                "name email profilePicture"
            )
            .sort({
                createdAt: 1,
            });

        return res.status(200).json({
            success: true,
            messages,
        });
    }
);