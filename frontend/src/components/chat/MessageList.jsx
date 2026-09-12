import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "../../hooks/useAuth.js";
import MessageBubble from "./MessageBubble.jsx";

const MessageList = ({ messages, loading, error, otherUser }) => {
    const { user } = useAuth();
    const bottomRef = useRef(null);
    const containerRef = useRef(null);

    const [showScrollButton, setShowScrollButton] = useState(false);

    // Scroll to bottom when new messages arrive AND the user is
    // already near the bottom. If they've scrolled up to read, do
    // not yank them down — show a jump-to-bottom button instead.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const nearBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
            120;

        if (nearBottom) {
            bottomRef.current?.scrollIntoView({ block: "end" });
        }
    }, [messages]);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const distance =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;

        setShowScrollButton(distance > 200);
    }, []);

    const jumpToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({
            block: "end",
            behavior: "smooth",
        });
    }, []);

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
        <div
            className="message-list"
            ref={containerRef}
            onScroll={handleScroll}
        >
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
                        otherUserId={otherUser?._id}
                    />
                );
            })}

            <div ref={bottomRef} />

            {showScrollButton ? (
                <button
                    type="button"
                    className="message-list__jump"
                    onClick={jumpToBottom}
                    aria-label="Scroll to latest messages"
                >
                    ↓
                </button>
            ) : null}
        </div>
    );
};

export default MessageList;