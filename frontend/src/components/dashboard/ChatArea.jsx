import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth.js";
import { getOtherParticipant } from "../../utils/conversationHelpers.js";
import { getMessages } from "../../api/conversationApi.js";
import { useSocket } from "../../hooks/useSocket.js";
import ChatHeader from "../chat/ChatHeader.jsx";
import MessageList from "../chat/MessageList.jsx";
import MessageComposer from "../chat/MessageComposer.jsx";

const ChatArea = ({ conversation }) => {
    const { user } = useAuth();
    const { socket, connected } = useSocket();

    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState("");

    const [otherTyping, setOtherTyping] = useState(false);
    const [typingConversationId, setTypingConversationId] = useState(null);
    const [sending, setSending] = useState(false);

    const conversationId = conversation?._id || null;
    const otherUser = getOtherParticipant(conversation, user?._id);

    // --------------------------------------------------------
    // Load message history when conversation changes
    // --------------------------------------------------------
    useEffect(() => {
        if (!conversationId) {
            return;
        }

        let cancelled = false;

        const load = async () => {
            setMessagesLoading(true);
            setMessagesError("");

            try {
                const { data } = await getMessages(conversationId);

                if (cancelled) return;

                setMessages(data.messages || []);
            } catch (error) {
                if (cancelled) return;

                const message =
                    error?.response?.data?.message ||
                    "Could not load messages";
                setMessagesError(message);
                setMessages([]);
            } finally {
                if (!cancelled) {
                    setMessagesLoading(false);
                }
            }
        };

        queueMicrotask(load);

        return () => {
            cancelled = true;
        };
    }, [conversationId]);

    // --------------------------------------------------------
    // Join / leave the socket room when conversation changes
    // --------------------------------------------------------
    useEffect(() => {
        if (!socket || !connected || !conversationId) {
            return;
        }

        socket.emit("join_conversation", conversationId, (res) => {
            if (!res?.success) {
                console.warn("[socket] join_conversation failed", res);
            }
        });

        return () => {
            socket.emit("leave_conversation", conversationId);
        };
    }, [socket, connected, conversationId]);

    // --------------------------------------------------------
    // Mark messages as read when the conversation opens
    // and whenever the tab regains focus
    // --------------------------------------------------------
    const markAsRead = useCallback(() => {
        if (!socket || !connected || !conversationId) return;

        socket.emit("mark_messages_read", conversationId);
    }, [socket, connected, conversationId]);

    useEffect(() => {
        if (!socket || !connected || !conversationId) return;

        queueMicrotask(markAsRead);

        const onFocus = () => markAsRead();
        window.addEventListener("focus", onFocus);

        return () => {
            window.removeEventListener("focus", onFocus);
        };
    }, [socket, connected, conversationId, markAsRead]);

    // --------------------------------------------------------
    // Subscribe to socket events for the open conversation
    // --------------------------------------------------------
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = ({ message }) => {
            if (!message) return;
            if (message.conversation !== conversationId) return;

            setMessages((prev) => {
                if (prev.some((m) => m._id === message._id)) {
                    return prev;
                }
                return [...prev, message];
            });

            // If the message came from the other user and we're on
            // the tab, mark it as read.
            const senderId =
                typeof message.sender === "object"
                    ? message.sender?._id
                    : message.sender;

            if (
                senderId?.toString() !== user?._id?.toString() &&
                document.visibilityState === "visible"
            ) {
                markAsRead();
            }
        };

        const handleUserTyping = ({ conversationId: cid, userId }) => {
            if (cid !== conversationId) return;
            if (userId?.toString() === user?._id?.toString()) return;
            setTypingConversationId(cid);
            setOtherTyping(true);
        };

        const handleUserStoppedTyping = ({
            conversationId: cid,
            userId,
        }) => {
            if (cid !== conversationId) return;
            if (userId?.toString() === user?._id?.toString()) return;
            setTypingConversationId(null);
            setOtherTyping(false);
        };

        const handleMessagesRead = ({ conversationId: cid, userId }) => {
            if (cid !== conversationId) return;

            setMessages((prev) =>
                prev.map((m) => {
                    const alreadyRead = m.readBy?.some(
                        (id) => id?.toString() === userId?.toString()
                    );
                    if (alreadyRead) return m;
                    return {
                        ...m,
                        readBy: [...(m.readBy || []), userId],
                    };
                })
            );
        };

        socket.on("new_message", handleNewMessage);
        socket.on("user_typing", handleUserTyping);
        socket.on("user_stopped_typing", handleUserStoppedTyping);
        socket.on("messages_read", handleMessagesRead);

        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("user_typing", handleUserTyping);
            socket.off("user_stopped_typing", handleUserStoppedTyping);
            socket.off("messages_read", handleMessagesRead);
        };
    }, [socket, conversationId, user?._id, markAsRead]);

    // --------------------------------------------------------
    // Send a message (real, via socket)
    // --------------------------------------------------------
    const handleSend = useCallback(
        (content) => {
            if (!socket || !connected || !conversationId) {
                toast.error("Not connected. Please wait a moment.");
                return;
            }

            setSending(true);

            socket.emit(
                "send_message",
                { conversationId, content },
                (res) => {
                    setSending(false);

                    if (!res?.success) {
                        toast.error(
                            res?.message || "Could not send message"
                        );
                        return;
                    }

                    // The server broadcasts new_message to the room,
                    // including this socket. We do NOT append here.
                    // It will arrive via the new_message handler and
                    // be deduped by _id.
                }
            );
        },
        [socket, connected, conversationId]
    );

    // --------------------------------------------------------
    // Typing signal from composer
    // --------------------------------------------------------
    const handleTypingStart = useCallback(() => {
        if (!socket || !connected || !conversationId) return;
        socket.emit("typing_start", conversationId);
    }, [socket, connected, conversationId]);

    const handleTypingStop = useCallback(() => {
        if (!socket || !connected || !conversationId) return;
        socket.emit("typing_stop", conversationId);
    }, [socket, connected, conversationId]);

    // --------------------------------------------------------
    // Render
    // --------------------------------------------------------
    if (!conversation) {
        return (
            <section className="chat-area chat-area--empty">
                <div className="chat-area__welcome">
                    <div className="chat-area__welcome-icon">
                        <span>💬</span>
                    </div>

                    <div className="chat-area__welcome-content">
                        <h1 className="chat-area__welcome-title">
                            Welcome to Talkio
                        </h1>

                        <p className="chat-area__welcome-description">
                            Select a conversation to start chatting or
                            open the Friends tab to begin a new one.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="chat-area">
            <ChatHeader
                user={otherUser}
                typing={
                    otherTyping && typingConversationId === conversationId
                }
            />

            <div className="chat-area__messages">
                <MessageList
                    messages={messages}
                    loading={messagesLoading}
                    error={messagesError}
                    otherUser={otherUser}
                />
            </div>

            <MessageComposer
                key={conversationId}
                onSend={handleSend}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
                disabled={!conversationId || !connected}
                sending={sending}
            />
        </section>
    );
};

export default ChatArea;