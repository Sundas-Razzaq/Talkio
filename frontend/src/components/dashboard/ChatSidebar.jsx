import { useAuth } from "../../hooks/useAuth.js";

const ChatSidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="chat-sidebar">
            <header className="chat-sidebar__header">
                <div className="chat-sidebar__brand">
                    <h1 className="chat-sidebar__brand-name">
                        Talkio
                    </h1>
                </div>

                <button
                    type="button"
                    className="chat-sidebar__menu-button"
                    aria-label="Open menu"
                >
                    <span>•••</span>
                </button>
            </header>

            <div className="chat-sidebar__search">
                <div className="chat-sidebar__search-wrapper">
                    <span
                        className="chat-sidebar__search-icon"
                        aria-hidden="true"
                    >
                        ⌕
                    </span>

                    <input
                        type="search"
                        className="chat-sidebar__search-input"
                        placeholder="Search or start a chat"
                        aria-label="Search or start a chat"
                    />
                </div>
            </div>

            <section className="chat-sidebar__conversations">
                <header className="chat-sidebar__section-header">
                    <h2 className="chat-sidebar__section-title">
                        Chats
                    </h2>
                </header>

                <div className="chat-sidebar__empty">
                    <div className="chat-sidebar__empty-icon">
                        <span>💬</span>
                    </div>

                    <h3 className="chat-sidebar__empty-title">
                        No conversations yet
                    </h3>

                    <p className="chat-sidebar__empty-description">
                        Search for a friend above to start your first
                        conversation.
                    </p>
                </div>
            </section>

            <footer className="chat-sidebar__footer">
                <div className="chat-sidebar__profile">
                    <div className="chat-sidebar__avatar">
                        {user?.profilePicture?.url ? (
                            <img
                                src={user.profilePicture.url}
                                alt={user.name}
                                className="chat-sidebar__avatar-image"
                            />
                        ) : (
                            <span className="chat-sidebar__avatar-placeholder">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="chat-sidebar__user-info">
                        <p className="chat-sidebar__user-name">
                            {user?.name}
                        </p>

                        <p className="chat-sidebar__user-status">
                            Available
                        </p>
                    </div>

                    <button
                        type="button"
                        className="chat-sidebar__profile-button"
                        aria-label="Open profile options"
                    >
                        •••
                    </button>
                </div>
            </footer>
        </aside>
    );
};

export default ChatSidebar;