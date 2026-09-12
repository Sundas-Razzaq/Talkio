const formatTime = (isoString) => {
    if (!isoString) return "";

    try {
        return new Date(isoString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
};

const MessageBubble = ({ message, isOwn, otherUserId }) => {
    if (!message) return null;

    const time = formatTime(message.createdAt);

    const readBy = message.readBy || [];
    const isReadByOther =
        isOwn &&
        otherUserId &&
        readBy.some(
            (id) => id?.toString() === otherUserId?.toString()
        );

    const tickClass =
        "message-bubble__ticks" +
        (isReadByOther ? " message-bubble__ticks--read" : "");

    return (
        <div
            className={
                "message-bubble" +
                (isOwn
                    ? " message-bubble--own"
                    : " message-bubble--other")
            }
        >
            <p className="message-bubble__content">
                {message.content}
            </p>

            <span className="message-bubble__time">
                {time}
                {isOwn ? (
                    <span
                        className={tickClass}
                        aria-label={
                            isReadByOther ? "Read" : "Sent"
                        }
                    >
                        {isReadByOther ? "✓✓" : "✓"}
                    </span>
                ) : null}
            </span>
        </div>
    );
};

export default MessageBubble;