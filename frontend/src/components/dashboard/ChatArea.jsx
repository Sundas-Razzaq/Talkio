const ChatArea = () => {
    return (
        <section className="chat-area">
            <div className="chat-area__welcome">
                <div className="chat-area__welcome-icon">
                    <span>💬</span>
                </div>

                <div className="chat-area__welcome-content">
                    <h1 className="chat-area__welcome-title">
                        Welcome to Talkio
                    </h1>

                    <p className="chat-area__welcome-description">
                        Select a conversation to start chatting or search
                        for a friend to begin a new conversation.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ChatArea;