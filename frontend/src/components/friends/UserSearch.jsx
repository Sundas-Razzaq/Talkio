import { useState } from "react";
import { toast } from "react-toastify";

import { inviteUserByEmail } from "../../api/connectionApi.js";

const UserSearch = ({
    status,
    user,
    errorMessage,
    searchedEmail,
}) => {
    const [inviting, setInviting] = useState(false);
    const [invited, setInvited] = useState(false);

    const handleInvite = async () => {
        if (inviting || invited) return;

        try {
            setInviting(true);
            await inviteUserByEmail(searchedEmail);
            setInvited(true);
            toast.success("Invitation sent successfully");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Could not send invitation";
            toast.error(message);
        } finally {
            setInviting(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="search-results search-results--loading">
                <p className="search-results__message">
                    Searching…
                </p>
            </div>
        );
    }

    if (status === "idle") {
        return null;
    }

    if (status === "self") {
        return (
            <div className="search-results search-results--self">
                <p className="search-results__message">
                    You can't search for yourself.
                </p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="search-results search-results--error">
                <p className="search-results__message">
                    {errorMessage || "Something went wrong."}
                </p>
            </div>
        );
    }

    if (status === "not-found") {
        return (
            <div className="search-results search-results--not-found">
                <div className="search-results__empty">
                    <h3 className="search-results__empty-title">
                        No Talkio user with that email
                    </h3>

                    <p className="search-results__empty-description">
                        You can invite <strong>{searchedEmail}</strong> to
                        join Talkio.
                    </p>

                    <button
                        type="button"
                        className="search-results__invite-button"
                        onClick={handleInvite}
                        disabled={inviting || invited}
                    >
                        {invited
                            ? "Invitation sent"
                            : inviting
                                ? "Sending…"
                                : "Invite to Talkio"}
                    </button>
                </div>
            </div>
        );
    }

    if (status === "found" && user) {
        return (
            <div className="search-results search-results--found">
                <article className="user-card">
                    <div className="user-card__avatar">
                        {user.profilePicture?.url ? (
                            <img
                                src={user.profilePicture.url}
                                alt={user.name}
                                className="user-card__avatar-image"
                            />
                        ) : (
                            <span className="user-card__avatar-placeholder">
                                {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="user-card__info">
                        <p className="user-card__name">
                            {user.name}
                        </p>
                        <p className="user-card__email">
                            {user.email}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="user-card__action"
                        disabled
                        title="Friend requests will be wired in the next phase"
                    >
                        Add friend
                    </button>
                </article>
            </div>
        );
    }

    return null;
};

export default UserSearch;