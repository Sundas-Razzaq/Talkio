import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ChatHeader = ({ user, typing, onBack }) => {
    if (!user) return null;

    return (
        <motion.header
            className="chat-header"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {onBack ? (
                <button
                    type="button"
                    className="chat-header__back"
                    onClick={onBack}
                    aria-label="Back to conversations"
                >
                    <ArrowLeft size={19} strokeWidth={1.8} />
                </button>
            ) : null}

            <div className="chat-header__avatar">
                {user.profilePicture?.url ? (
                    <img
                        src={user.profilePicture.url}
                        alt={user.name}
                        className="chat-header__avatar-image"
                    />
                ) : (
                    <span className="chat-header__avatar-placeholder">
                        {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                )}
            </div>

            <div className="chat-header__info">
                <p className="chat-header__name">{user.name}</p>

                {typing ? (
                    <p className="chat-header__status chat-header__status--typing">
                        typing…
                    </p>
                ) : (
                    <p className="chat-header__status">Available</p>
                )}
            </div>
        </motion.header>
    );
};

export default ChatHeader;