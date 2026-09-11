import FriendCard from "./FriendCard.jsx";

const RequestsList = ({ requests, loading, onRespond, respondingId }) => {
    if (loading) {
        return (
            <div className="requests-list requests-list--loading">
                <p className="requests-list__message">
                    Loading requests…
                </p>
            </div>
        );
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="requests-list requests-list--empty">
                <h3 className="requests-list__empty-title">
                    No pending requests
                </h3>
                <p className="requests-list__empty-description">
                    When someone sends you a friend request, it will show up
                    here.
                </p>
            </div>
        );
    }

    return (
        <ul className="requests-list">
            {requests.map((request) => {
                const isResponding = respondingId === request._id;

                return (
                    <li key={request._id} className="requests-list__item">
                        <FriendCard
                            user={request.requester}
                            actionSlot={
                                <>
                                    <button
                                        type="button"
                                        className="requests-list__action requests-list__action--accept"
                                        onClick={() =>
                                            onRespond(request._id, "accept")
                                        }
                                        disabled={isResponding}
                                    >
                                        {isResponding ? "…" : "Accept"}
                                    </button>
                                    <button
                                        type="button"
                                        className="requests-list__action requests-list__action--reject"
                                        onClick={() =>
                                            onRespond(request._id, "reject")
                                        }
                                        disabled={isResponding}
                                    >
                                        {isResponding ? "…" : "Reject"}
                                    </button>
                                </>
                            }
                        />
                    </li>
                );
            })}
        </ul>
    );
};

export default RequestsList;