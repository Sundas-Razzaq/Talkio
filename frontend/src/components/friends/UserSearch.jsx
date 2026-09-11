import { useState } from "react";
import { toast } from "react-toastify";

import { inviteUserByEmail } from "../../api/connectionApi.js";
import FriendCard from "./FriendCard.jsx";

const UserSearch = ({
    status,
    user,
    errorMessage,
    searchedEmail,
    friendshipStatus,
    onSendRequest,
    onAcceptRequest,
}) => {
    const [inviting, setInviting] = useState(false);
    const [invitedEmail, setInvitedEmail] = useState(null);
    const [sending, setSending] = useState(false);
    const [sentEmail, setSentEmail] = useState(null);
    const [accepting, setAccepting] = useState(false);

    const invited = invitedEmail === searchedEmail;
    const sent = sentEmail === searchedEmail;

    const handleInvite = async () => {
        if (inviting || invited) return;

        try {
            setInviting(true);
            await inviteUserByEmail(searchedEmail);
            setInvitedEmail(searchedEmail);
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

    const handleAddFriend = async () => {
        if (sending || sent || !user) return;

        try {
            setSending(true);
            await onSendRequest(user._id);
            setSentEmail(searchedEmail);
            toast.success("Friend request sent");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Could not send friend request";
            toast.error(message);
        } finally {
            setSending(false);
        }
    };

    const handleAccept = async () => {
        if (accepting) return;

        try {
            setAccepting(true);
            await onAcceptRequest(user._id);
            toast.success("Friend request accepted");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Could not accept request";
            toast.error(message);
        } finally {
            setAccepting(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="search-results search-results--loading">
                <p className="search-results__message">Searching…</p>
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
        let action;

        if (friendshipStatus === "friends") {
            action = (
                <button
                    type="button"
                    className="user-card__action user-card__action--muted"
                    disabled
                >
                    Friends
                </button>
            );
        } else if (friendshipStatus === "incoming") {
            action = (
                <button
                    type="button"
                    className="user-card__action user-card__action--accept"
                    onClick={handleAccept}
                    disabled={accepting}
                >
                    {accepting ? "…" : "Accept request"}
                </button>
            );
        } else if (sent) {
            action = (
                <button
                    type="button"
                    className="user-card__action user-card__action--muted"
                    disabled
                >
                    Request sent
                </button>
            );
        } else {
            action = (
                <button
                    type="button"
                    className="user-card__action"
                    onClick={handleAddFriend}
                    disabled={sending}
                >
                    {sending ? "Sending…" : "Add friend"}
                </button>
            );
        }

        return (
            <div className="search-results search-results--found">
                <FriendCard user={user} actionSlot={action} />
            </div>
        );
    }

    return null;
};

export default UserSearch;