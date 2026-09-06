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
                    <p className="eyebrow">{eyebrow}</p>

                    <h1>Welcome to Talkio</h1>

                    <p>
                        A simple space to connect with people, start conversations,
                        and stay connected through real-time messaging.
                    </p>

                    <ul>
                        <li>Connect with friends</li>
                        <li>Start private conversations</li>
                        <li>Chat in real time</li>
                    </ul>
                </div>
            </section>

            <section className="auth-card">
                <div className="auth-card__header">
                    <p className="eyebrow">{eyebrow}</p>

                    <h2>{title}</h2>

                    <p>{subtitle}</p>
                </div>

                {children}

                {footer ? (
                    <div className="auth-card__footer">
                        {footer}
                    </div>
                ) : null}
            </section>
        </main>
    );
};

export default AuthPageShell;