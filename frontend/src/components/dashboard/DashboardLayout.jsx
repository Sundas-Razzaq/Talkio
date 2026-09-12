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

    // Total unread messages across all conversations (capped at 99)
    const unreadCount = useMemo(() => {
        if (!userId) return 0;

        const sum = conversations.reduce(
            (acc, conversation) =>
                acc + (conversation.unreadCount || 0),
            0
        );

        return sum > 99 ? 99 : sum;
    }, [conversations, userId]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        setMobileView("chat");

        // Optimistically clear unreadCount on the selected conversation
        setConversations((prev) =>
            prev.map((c) =>
                c._id === conversation._id
                    ? { ...c, unreadCount: 0 }
                    : c
            )
        );
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