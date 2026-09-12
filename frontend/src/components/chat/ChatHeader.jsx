const ChatHeader = ({ user }) => {
    if (!user) return null;

    return (
        <header className="chat-header">
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
                <p className="chat-header__status">Available</p>
            </div>
        </header>
    );
};

export default ChatHeader;