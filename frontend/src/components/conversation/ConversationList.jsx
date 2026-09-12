import { useAuth } from "../../hooks/useAuth.js";
import { getOtherParticipant } from "../../utils/conversationHelpers.js";

const formatUnreadCount = (count) => {
    if (!count || count <= 0) return null;
    return count > 99 ? "99+" : String(count);
};

const ConversationList = ({
    conversations,
    loading,
    selectedConversationId,
    onSelectConversation,
}) => {
    const { user } = useAuth();

    if (loading) {
        return (
            <div className="conversation-list conversation-list--loading">
                <p className="conversation-list__message">
                    Loading conversations…
                </p>
            </div>
        );
    }

    if (!conversations || conversations.length === 0) {
        return (
            <div className="conversation-list conversation-list--empty">
                <div className="conversation-list__empty-icon">
                    <span>💬</span>
                </div>

                <h3 className="conversation-list__empty-title">
                    No conversations yet
                </h3>

                <p className="conversation-list__empty-description">
                    Open the Friends tab and tap a friend to start your
                    first conversation.
                </p>
            </div>
        );
    }

    return (
        <ul className="conversation-list">
            {conversations.map((conversation) => {
                const other = getOtherParticipant(
                    conversation,
                    user?._id
                );

                if (!other) return null;

                const isSelected =
                    conversation._id === selectedConversationId;

                const preview = conversation.lastMessage?.content
                    ? conversation.lastMessage.content
                    : "No messages yet";

                const unreadBadge = formatUnreadCount(
                    conversation.unreadCount
                );

                const isUnread =
                    unreadBadge !== null && !isSelected;

                return (
                    <li
                        key={conversation._id}
                        className="conversation-list__item"
                    >
                        <button
                            type="button"
                            className={
                                "conversation-row" +
                                (isSelected
                                    ? " conversation-row--selected"
                                    : "") +
                                (isUnread
                                    ? " conversation-row--unread"
                                    : "")
                            }
                            onClick={() =>
                                onSelectConversation(conversation)
                            }
                        >
                            <div className="conversation-row__avatar">
                                {other.profilePicture?.url ? (
                                    <img
                                        src={other.profilePicture.url}
                                        alt={other.name}
                                        className="conversation-row__avatar-image"
                                    />
                                ) : (
                                    <span className="conversation-row__avatar-placeholder">
                                        {other.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="conversation-row__body">
                                <p className="conversation-row__name">
                                    {other.name}
                                </p>

                                <p className="conversation-row__preview">
                                    {preview}
                                </p>
                            </div>

                            {unreadBadge ? (
                                <span className="conversation-row__badge">
                                    {unreadBadge}
                                </span>
                            ) : null}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default ConversationList;