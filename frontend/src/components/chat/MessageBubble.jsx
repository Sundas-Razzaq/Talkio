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

const MessageBubble = ({ message, isOwn }) => {
    if (!message) return null;

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
                {formatTime(message.createdAt)}
            </span>
        </div>
    );
};

export default MessageBubble;