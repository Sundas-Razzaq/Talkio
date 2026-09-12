import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth.js";
import { getOtherParticipant } from "../../utils/conversationHelpers.js";
import { getMessages } from "../../api/conversationApi.js";

import ChatHeader from "../chat/ChatHeader.jsx";
import MessageList from "../chat/MessageList.jsx";
import MessageComposer from "../chat/MessageComposer.jsx";

const ChatArea = ({ conversation }) => {
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState("");

    const conversationId = conversation?._id || null;

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

    const other = getOtherParticipant(conversation, user?._id);
    // Phase 7 seam: replace this body with a Socket.IO emit
    // (send_message) and keep the optimistic append (or wait for
    // the server's new_message event and append then).
    const handleSend = () => {
        toast.info("Real-time sending arrives in Phase 7");
        // Intentionally does NOT append to `messages`.
    };

    return (
        <section className="chat-area">
            <ChatHeader user={other} />

            <div className="chat-area__messages">
                <MessageList
                    messages={messages}
                    loading={messagesLoading}
                    error={messagesError}
                    otherUser={other}
                />
            </div>

            <MessageComposer
                onSend={handleSend}
                disabled={!conversationId}
            />
        </section>
    );
};

export default ChatArea;