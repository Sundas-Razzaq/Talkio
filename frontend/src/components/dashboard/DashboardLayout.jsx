import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getConversations } from "../../api/conversationApi.js";
import { sortConversations } from "../../utils/conversationHelpers.js";

import ChatSidebar from "./ChatSidebar.jsx";
import ChatArea from "./ChatArea.jsx";

const DashboardLayout = () => {
    const [conversations, setConversations] = useState([]);
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const refreshConversations = useCallback(async () => {
        setConversationsLoading(true);

        try {
            const { data } = await getConversations();
            setConversations(sortConversations(data.conversations || []));
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

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
    };

    const handleConversationCreated = (conversation) => {
        setConversations((prev) => {
            const exists = prev.some((c) => c._id === conversation._id);
            const next = exists
                ? prev.map((c) =>
                    c._id === conversation._id ? conversation : c
                )
                : [conversation, ...prev];

            return sortConversations(next);
        });

        setSelectedConversation(conversation);
    };

    return (
        <div className="chat-dashboard">
            <ChatSidebar
                conversations={conversations}
                conversationsLoading={conversationsLoading}
                selectedConversationId={selectedConversation?._id || null}
                onSelectConversation={handleSelectConversation}
                onConversationCreated={handleConversationCreated}
                onRefreshConversations={refreshConversations}
            />

            <ChatArea conversation={selectedConversation} />
        </div>
    );
};

export default DashboardLayout;