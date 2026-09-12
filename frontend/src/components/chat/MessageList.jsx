import { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import MessageBubble from "./MessageBubble.jsx";

const MessageList = ({ messages, loading, error, otherUser }) => {
    const { user } = useAuth();
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!bottomRef.current) return;
        bottomRef.current.scrollIntoView({ block: "end" });
    }, [messages]);

    if (loading) {
        return (
            <div className="message-list message-list--loading">
                <p className="message-list__message">
                    Loading messages…
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="message-list message-list--error">
                <p className="message-list__message">{error}</p>
            </div>
        );
    }

    if (!messages || messages.length === 0) {
        return (
            <div className="message-list message-list--empty">
                <div className="message-list__empty">
                    <h2 className="message-list__empty-title">
                        No messages yet
                    </h2>
                    <p className="message-list__empty-description">
                        Say hi to {otherUser?.name || "your friend"} to get
                        the conversation started.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="message-list">
            {messages.map((message) => {
                const senderId =
                    typeof message.sender === "object"
                        ? message.sender?._id
                        : message.sender;

                const isOwn =
                    senderId?.toString() === user?._id?.toString();

                return (
                    <MessageBubble
                        key={message._id}
                        message={message}
                        isOwn={isOwn}
                    />
                );
            })}

            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;