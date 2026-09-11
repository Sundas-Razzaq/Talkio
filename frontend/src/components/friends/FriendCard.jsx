const FriendCard = ({ user, actionSlot, onClick, clickable = false }) => {
    const handleClick = () => {
        if (clickable && onClick) {
            onClick(user);
        }
    };

    return (
        <article
            className={`friend-card${clickable ? " friend-card--clickable" : ""}`}
            onClick={handleClick}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
                clickable
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleClick();
                        }
                    }
                    : undefined
            }
        >
            <div className="friend-card__avatar">
                {user?.profilePicture?.url ? (
                    <img
                        src={user.profilePicture.url}
                        alt={user.name}
                        className="friend-card__avatar-image"
                    />
                ) : (
                    <span className="friend-card__avatar-placeholder">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                )}
            </div>

            <div className="friend-card__info">
                <p className="friend-card__name">
                    {user?.name}
                </p>
                <p className="friend-card__email">
                    {user?.email}
                </p>
            </div>

            {actionSlot && (
                <div
                    className="friend-card__action"
                    onClick={(event) => event.stopPropagation()}
                >
                    {actionSlot}
                </div>
            )}
        </article>
    );
};

export default FriendCard;