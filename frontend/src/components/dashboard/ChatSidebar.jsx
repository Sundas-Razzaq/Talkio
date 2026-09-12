import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth.js";
import { searchUserByEmail } from "../../api/userApi.js";
import { getOrCreateConversation } from "../../api/conversationApi.js";
import {
    getFriends,
    getFriendRequests,
    sendFriendRequest,
    respondToFriendRequest,
} from "../../api/connectionApi.js";

import UserSearch from "../friends/UserSearch.jsx";
import SidebarTabs from "../friends/SideBarTabs.jsx";
import FriendsList from "../friends/FriendList.jsx";
import RequestsList from "../friends/FriendRequestList.jsx";
import ConversationList from "../conversation/ConversationList.jsx";

const ChatSidebar = ({
    conversations,
    conversationsLoading,
    selectedConversationId,
    onSelectConversation,
    onConversationCreated,
    onRefreshConversations,
}) => {
    const { user } = useAuth();

    // Sidebar mode
    const [activeTab, setActiveTab] = useState("chats");

    // Search state
    const [query, setQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("idle");
    const [searchUser, setSearchUser] = useState(null);
    const [searchError, setSearchError] = useState("");
    const [searchedEmail, setSearchedEmail] = useState("");

    // Connections state
    const [friends, setFriends] = useState([]);
    const [friendsLoading, setFriendsLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [respondingId, setRespondingId] = useState(null);

    // Per-friend starting state (prevents double clicks)
    const [startingFriendId, setStartingFriendId] = useState(null);

    const isSearching = searchStatus !== "idle" || query.trim() !== "";

    const refreshConnections = useCallback(async () => {
        setFriendsLoading(true);
        setRequestsLoading(true);

        try {
            const [friendsRes, requestsRes] = await Promise.all([
                getFriends(),
                getFriendRequests(),
            ]);

            setFriends(friendsRes.data.friends || []);
            setRequests(requestsRes.data.requests || []);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Could not load your connections";
            toast.error(message);
        } finally {
            setFriendsLoading(false);
            setRequestsLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(refreshConnections);
    }, [refreshConnections]);

    const resetSearch = () => {
        setQuery("");
        setSearchStatus("idle");
        setSearchUser(null);
        setSearchError("");
        setSearchedEmail("");
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        const email = query.trim().toLowerCase();

        if (!email) {
            resetSearch();
            return;
        }

        setSearchedEmail(email);
        setSearchError("");
        setSearchUser(null);
        setSearchStatus("loading");

        try {
            const response = await searchUserByEmail(email);
            setSearchUser(response.data.user);
            setSearchStatus("found");
        } catch (error) {
            const status = error?.response?.status;
            const message =
                error?.response?.data?.message || "Something went wrong";

            if (status === 404) {
                setSearchStatus("not-found");
            } else if (status === 400 && /yourself/i.test(message)) {
                setSearchStatus("self");
            } else {
                setSearchStatus("error");
                setSearchError(message);
            }
        }
    };

    const friendshipStatus = (() => {
        if (!searchUser) return "none";

        if (friends.some((f) => f._id === searchUser._id)) {
            return "friends";
        }

        if (
            requests.some(
                (r) => r.requester?._id === searchUser._id
            )
        ) {
            return "incoming";
        }

        return "none";
    })();

    const handleSendRequest = async (recipientId) => {
        await sendFriendRequest(recipientId);
    };

    const handleAcceptFromSearch = async (requesterId) => {
        const match = requests.find(
            (r) => r.requester?._id === requesterId
        );

        if (!match) {
            throw new Error("Request not found");
        }

        await respondToFriendRequest(match._id, "accept");
        await refreshConnections();
    };

    const handleRespond = async (connectionId, action) => {
        try {
            setRespondingId(connectionId);
            await respondToFriendRequest(connectionId, action);
            toast.success(
                action === "accept"
                    ? "Friend request accepted"
                    : "Friend request rejected"
            );
            await refreshConnections();
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Could not update request";
            toast.error(message);
        } finally {
            setRespondingId(null);
        }
    };

    const handleSelectFriend = async (friend) => {
        if (startingFriendId) return;

        try {
            setStartingFriendId(friend._id);

            const { data } = await getOrCreateConversation(friend._id);

            onConversationCreated?.(data.conversation);
            await onRefreshConversations?.();

            setActiveTab("chats");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Could not start conversation";
            toast.error(message);
        } finally {
            setStartingFriendId(null);
        }
    };

    return (
        <aside className="chat-sidebar">
            <header className="chat-sidebar__header">
                <div className="chat-sidebar__brand">
                    <h1 className="chat-sidebar__brand-name">Talkio</h1>
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
                <form
                    className="chat-sidebar__search-wrapper"
                    onSubmit={handleSearch}
                    role="search"
                >
                    <span
                        className="chat-sidebar__search-icon"
                        aria-hidden="true"
                    >
                        ⌕
                    </span>

                    <input
                        type="search"
                        className="chat-sidebar__search-input"
                        placeholder="Search by email or start a chat"
                        aria-label="Search by email or start a chat"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />

                    {isSearching && (
                        <button
                            type="button"
                            className="chat-sidebar__search-clear"
                            onClick={resetSearch}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </form>
            </div>

            {!isSearching && (
                <SidebarTabs
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    requestCount={requests.length}
                />
            )}

            <section className="chat-sidebar__conversations">
                {isSearching ? (
                    <UserSearch
                        status={searchStatus}
                        user={searchUser}
                        errorMessage={searchError}
                        searchedEmail={searchedEmail}
                        friendshipStatus={friendshipStatus}
                        onSendRequest={handleSendRequest}
                        onAcceptRequest={handleAcceptFromSearch}
                    />
                ) : activeTab === "chats" ? (
                    <ConversationList
                        conversations={conversations}
                        loading={conversationsLoading}
                        selectedConversationId={selectedConversationId}
                        onSelectConversation={onSelectConversation}
                    />
                ) : activeTab === "friends" ? (
                    <FriendsList
                        friends={friends}
                        loading={friendsLoading}
                        onSelectFriend={handleSelectFriend}
                        startingFriendId={startingFriendId}
                    />
                ) : (
                    <RequestsList
                        requests={requests}
                        loading={requestsLoading}
                        onRespond={handleRespond}
                        respondingId={respondingId}
                    />
                )}
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