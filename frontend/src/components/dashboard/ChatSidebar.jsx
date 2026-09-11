import { useState } from "react";

import { useAuth } from "../../hooks/useAuth.js";
import { searchUserByEmail } from "../../api/userApi.js";
import UserSearch from "../friends/UserSearch.jsx";

const ChatSidebar = () => {
    const { user } = useAuth();

    const [query, setQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("idle");
    const [searchUser, setSearchUser] = useState(null);
    const [searchError, setSearchError] = useState("");
    const [searchedEmail, setSearchedEmail] = useState("");

    const isSearching = searchStatus !== "idle" || query.trim() !== "";

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

            <section className="chat-sidebar__conversations">
                {searchStatus === "idle" ? (
                    <>
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
                                Search for a friend above to start your
                                first conversation.
                            </p>
                        </div>
                    </>
                ) : (
                    <UserSearch
                        status={searchStatus}
                        user={searchUser}
                        errorMessage={searchError}
                        searchedEmail={searchedEmail}
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