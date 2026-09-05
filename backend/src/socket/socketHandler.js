import socketAuth from "./socketAuth.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

const getRoomName = (conversationId) => {
    return `conversation:${conversationId}`;
};

const socketHandler = (io) => {
    // Authenticate every Socket.IO connection
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log(
            `Socket connected: ${socket.id} | User: ${socket.user.name}`
        );

        /*
         * JOIN CONVERSATION
         * Client asks to join a conversation room.
         */
        socket.on("join_conversation", async (conversationId, callback) => {
            try {
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: socket.user._id,
                });

                if (!conversation) {
                    return callback?.({
                        success: false,
                        message: "Conversation not found",
                    });
                }

                const room = getRoomName(conversationId);

                socket.join(room);

                console.log(
                    `User ${socket.user.name} joined conversation ${conversationId}`
                );

                callback?.({
                    success: true,
                    message: "Joined conversation successfully",
                    conversationId,
                });
            } catch (error) {
                callback?.({
                    success: false,
                    message: "Failed to join conversation",
                });
            }
        });

        /*
         * LEAVE CONVERSATION
         */
        socket.on("leave_conversation", (conversationId, callback) => {
            const room = getRoomName(conversationId);

            socket.leave(room);

            console.log(
                `User ${socket.user.name} left conversation ${conversationId}`
            );

            callback?.({
                success: true,
                message: "Left conversation successfully",
            });
        });

        /*
         * SEND MESSAGE
         */
        socket.on("send_message", async (data, callback) => {
            try {
                const { conversationId, content } = data || {};

                if (!conversationId) {
                    return callback?.({
                        success: false,
                        message: "Conversation ID is required",
                    });
                }

                if (!content || !content.trim()) {
                    return callback?.({
                        success: false,
                        message: "Message content is required",
                    });
                }

                if (content.trim().length > 5000) {
                    return callback?.({
                        success: false,
                        message: "Message cannot exceed 5000 characters",
                    });
                }

                /*
                 * Verify that the authenticated user
                 * belongs to this conversation.
                 */
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: socket.user._id,
                });

                if (!conversation) {
                    return callback?.({
                        success: false,
                        message: "Conversation not found",
                    });
                }

                /*
                 * Save message to MongoDB.
                 */
                const message = await Message.create({
                    conversation: conversationId,
                    sender: socket.user._id,
                    content: content.trim(),
                    readBy: [socket.user._id],
                });

                /*
                 * Populate sender information before
                 * sending the message to clients.
                 */
                await message.populate(
                    "sender",
                    "name email profilePicture"
                );

                /*
                 * Update conversation's latest message.
                 */
                conversation.lastMessage = message._id;
                conversation.lastMessageAt = message.createdAt;

                await conversation.save();

                const room = getRoomName(conversationId);

                /*
                 * Send the new message to everyone
                 * inside this conversation room.
                 */
                io.to(room).emit("new_message", {
                    message,
                });

                /*
                 * Acknowledge successful message creation
                 * to the sender.
                 */
                callback?.({
                    success: true,
                    message,
                });
            } catch (error) {
                console.error("Send message error:", error);

                callback?.({
                    success: false,
                    message: "Failed to send message",
                });
            }
        });

        /*TYPING START*/
        socket.on("typing_start", async (conversationId) => {
            try {
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: socket.user._id,
                });

                if (!conversation) return;

                const room = getRoomName(conversationId);

                socket.to(room).emit("user_typing", {
                    conversationId,
                    userId: socket.user._id,
                    userName: socket.user.name,
                });
            } catch (error) {
                console.error("Typing start error:", error);
            }
        });

        /*TYPING STOP*/
        socket.on("typing_stop", async (conversationId) => {
            try {
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: socket.user._id,
                });

                if (!conversation) return;

                const room = getRoomName(conversationId);

                socket.to(room).emit("user_stopped_typing", {
                    conversationId,
                    userId: socket.user._id,
                });
            } catch (error) {
                console.error("Typing stop error:", error);
            }
        });

        /*MARK MESSAGES AS READ*/
        socket.on("mark_messages_read", async (conversationId, callback) => {
            try {
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: socket.user._id,
                });

                if (!conversation) {
                    return callback?.({
                        success: false,
                        message: "Conversation not found",
                    });
                }

                /*Add the current user to readBy for all messages they haven't read yet.*/
                await Message.updateMany(
                    {
                        conversation: conversationId,
                        readBy: {
                            $ne: socket.user._id,
                        },
                    },
                    {
                        $addToSet: {
                            readBy: socket.user._id,
                        },
                    }
                );

                const room = getRoomName(conversationId);

                /*Tell the other participant that messages have been read.*/
                socket.to(room).emit("messages_read", {
                    conversationId,
                    userId: socket.user._id,
                });

                callback?.({
                    success: true,
                    message: "Messages marked as read",
                });
            } catch (error) {
                console.error("Mark messages read error:", error);

                callback?.({
                    success: false,
                    message: "Failed to mark messages as read",
                });
            }
        });

        /* DISCONNECT*/
        socket.on("disconnect", () => {
            console.log(
                `Socket disconnected: ${socket.id} | User: ${socket.user.name}`
            );
        });
    });
};

export default socketHandler;