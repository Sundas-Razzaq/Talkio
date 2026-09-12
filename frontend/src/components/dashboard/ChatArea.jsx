import { useAuth } from "../../hooks/useAuth.js";
import { getOtherParticipant } from "../../utils/conversationHelpers.js";
import ChatHeader from "../chat/ChatHeader.jsx";

const ChatArea = ({ conversation }) => {
    const { user } = useAuth();

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

    return (
        <section className="chat-area">
            <ChatHeader user={other} />

            <div className="chat-area__messages chat-area__messages--empty">
                <div className="chat-area__messages-empty">
                    <h2 className="chat-area__messages-empty-title">
                        No messages yet
                    </h2>

                    <p className="chat-area__messages-empty-description">
                        Say hi to {other?.name || "your friend"} to get
                        the conversation started.
                    </p>
                </div>
            </div>

            {/* Message input comes in Phase 6 */}
        </section>
    );
};

export default ChatArea;