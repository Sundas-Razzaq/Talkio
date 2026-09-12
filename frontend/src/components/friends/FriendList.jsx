import FriendCard from "./FriendCard.jsx";

const FriendsList = ({
    friends,
    loading,
    onSelectFriend,
    startingFriendId,
}) => {
    if (loading) {
        return (
            <div className="friends-list friends-list--loading">
                <p className="friends-list__message">Loading friends…</p>
            </div>
        );
    }

    if (!friends || friends.length === 0) {
        return (
            <div className="friends-list friends-list--empty">
                <h3 className="friends-list__empty-title">
                    No friends yet
                </h3>
                <p className="friends-list__empty-description">
                    Search for someone above and send them a friend request.
                </p>
            </div>
        );
    }

    return (
        <ul className="friends-list">
            {friends.map((friend) => {
                const isStarting = startingFriendId === friend._id;

                return (
                    <li key={friend._id} className="friends-list__item">
                        <FriendCard
                            user={friend}
                            clickable={!isStarting}
                            onClick={onSelectFriend}
                            actionSlot={
                                isStarting ? (
                                    <span className="friend-card__starting">
                                        Starting…
                                    </span>
                                ) : null
                            }
                        />
                    </li>
                );
            })}
        </ul>
    );
};

export default FriendsList;