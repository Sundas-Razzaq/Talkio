export const getOtherParticipant = (conversation, currentUserId) => {
    if (!conversation || !conversation.participants || !currentUserId) {
        return null;
    }

    return (
        conversation.participants.find(
            (participant) =>
                participant._id?.toString() !== currentUserId?.toString()
        ) || null
    );
};

export const sortConversations = (conversations) => {
    return [...conversations].sort((a, b) => {
        const aTime = new Date(
            a.lastMessageAt || a.updatedAt || a.createdAt || 0
        ).getTime();
        const bTime = new Date(
            b.lastMessageAt || b.updatedAt || b.createdAt || 0
        ).getTime();

        return bTime - aTime;
    });
};