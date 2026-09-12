const AuthPageShell = ({
    eyebrow,
    title,
    subtitle,
    children,
    footer,
}) => {
    return (
        <main className="auth-page">
            <section className="auth-hero" aria-hidden="true">
                <div className="auth-hero__glow auth-hero__glow--one" />
                <div className="auth-hero__glow auth-hero__glow--two" />

                <div className="auth-hero__content">
                    <p className="eyebrow eyebrow--light">
                        {eyebrow || "Talkio"}
                    </p>

                    <h1 className="auth-hero__title">
                        Welcome to Talkio
                    </h1>

                    <p className="auth-hero__description">
                        A simple space to connect with people, start
                        conversations, and stay connected through real-time
                        messaging.
                    </p>

                    <ul className="auth-hero__list">
                        <li className="auth-hero__list-item">
                            Connect with friends
                        </li>
                        <li className="auth-hero__list-item">
                            Start private conversations
                        </li>
                        <li className="auth-hero__list-item">
                            Chat in real time
                        </li>
                    </ul>
                </div>
            </section>

            <section className="auth-card">
                <div className="auth-card__header">
                    <p className="eyebrow">{eyebrow}</p>

                    <h2 className="auth-card__title">{title}</h2>

                    <p className="auth-card__subtitle">{subtitle}</p>
                </div>

                {children}

                {footer ? (
                    <div className="auth-card__footer">{footer}</div>
                ) : null}
            </section>
        </main>
    );
};

export default AuthPageShell;