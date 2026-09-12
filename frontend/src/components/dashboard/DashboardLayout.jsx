import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth.js";
import { getConversations } from "../../api/conversationApi.js";
import { sortConversations } from "../../utils/conversationHelpers.js";

import ChatSidebar from "./ChatSidebar.jsx";
import ChatArea from "./ChatArea.jsx";

const DashboardLayout = () => {
    const { user } = useAuth();
    const userId = user?._id || null;

    const [conversations, setConversations] = useState([]);
    const [conversationsLoading, setConversationsLoading] =
        useState(true);
    const [selectedConversation, setSelectedConversation] =
        useState(null);
    const [mobileView, setMobileView] = useState("sidebar");

    // Session-only "seen" set — ids of conversations the user has
    // opened in this browser session.
    const [seenConversationIds, setSeenConversationIds] = useState(
        () => new Set()
    );

    const refreshConversations = useCallback(async () => {
        setConversationsLoading(true);

        try {
            const { data } = await getConversations();
            setConversations(
                sortConversations(data.conversations || [])
            );
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Could not load conversations";
            toast.error(message);
        } finally {
            setConversationsLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(refreshConversations);
    }, [refreshConversations]);

    const unreadCount = useMemo(() => {
        if (!userId) return 0;

        return conversations.filter((conversation) => {
            if (seenConversationIds.has(conversation._id)) {
                return false;
            }

            const senderId = conversation.lastMessage?.sender;
            if (!senderId) return false;

            const normalizedSender =
                typeof senderId === "object"
                    ? senderId?._id
                    : senderId;

            return (
                normalizedSender?.toString() !== userId.toString()
            );
        }).length;
    }, [conversations, seenConversationIds, userId]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        setMobileView("chat");

        setSeenConversationIds((prev) => {
            if (prev.has(conversation._id)) return prev;
            const next = new Set(prev);
            next.add(conversation._id);
            return next;
        });
    };

    const handleConversationCreated = (conversation) => {
        setConversations((prev) => {
            const exists = prev.some(
                (c) => c._id === conversation._id
            );
            const next = exists
                ? prev.map((c) =>
                    c._id === conversation._id
                        ? conversation
                        : c
                )
                : [conversation, ...prev];

            return sortConversations(next);
        });

        setSelectedConversation(conversation);
        setMobileView("chat");

        setSeenConversationIds((prev) => {
            if (prev.has(conversation._id)) return prev;
            const next = new Set(prev);
            next.add(conversation._id);
            return next;
        });
    };

    return (
        <div
            className={
                "chat-dashboard chat-dashboard--view-" + mobileView
            }
        >
            <ChatSidebar
                conversations={conversations}
                conversationsLoading={conversationsLoading}
                selectedConversationId={
                    selectedConversation?._id || null
                }
                onSelectConversation={handleSelectConversation}
                onConversationCreated={handleConversationCreated}
                onRefreshConversations={refreshConversations}
                unreadCount={unreadCount}
            />

            <ChatArea
                conversation={selectedConversation}
                onBack={() => setMobileView("sidebar")}
            />
        </div>
    );
};

export default DashboardLayout;