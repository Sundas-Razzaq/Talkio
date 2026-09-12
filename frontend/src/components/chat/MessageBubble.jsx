import { Check, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

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
        <motion.div
            className={
                "message-bubble" +
                (isOwn
                    ? " message-bubble--own"
                    : " message-bubble--other")
            }
            initial={{ opacity: 0, y: 7, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
                        {isReadByOther ? (
                            <CheckCheck size={13} strokeWidth={2.2} />
                        ) : (
                            <Check size={13} strokeWidth={2.2} />
                        )}
                    </span>
                ) : null}
            </span>
        </motion.div>
    );
};

export default MessageBubble;