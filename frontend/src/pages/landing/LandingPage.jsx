import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
const LandingPage = () => {
    return (
        <main className="landing-page">
            {/* Navigation */}
            <header className="landing-header">
                <div className="landing-container landing-header__inner">
                    <Link to="/" className="landing-brand">
                        <img
                            src={logo}
                            alt=""
                            className="landing-brand__logo"
                            aria-hidden="true"
                        />
                        <span className="landing-brand__text">Talkio</span>
                    </Link>

                    <nav className="landing-nav" aria-label="Main navigation">
                        <Link to="/login" className="landing-nav__link">
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="landing-nav__link landing-nav__link--primary"
                        >
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="landing-hero">
                <div className="landing-container landing-hero__content">
                    <div className="landing-hero__text">
                        <p className="landing-eyebrow">
                            Simple. Personal. Real-time.
                        </p>

                        <h1 className="landing-hero__title">
                            Stay connected with the people who matter.
                        </h1>

                        <p className="landing-hero__description">
                            Talkio gives you a simple place to connect with friends,
                            start private conversations, and chat in real time.
                        </p>

                        <div className="landing-hero__actions">
                            <Link
                                to="/register"
                                className="landing-button landing-button--primary"
                            >
                                Create an account
                            </Link>

                            <Link
                                to="/login"
                                className="landing-button landing-button--secondary"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    <div className="landing-hero__visual" aria-hidden="true">
                        <div className="landing-chat-preview">
                            <div className="landing-chat-preview__header">
                                <div className="landing-avatar" />
                                <div>
                                    <span className="landing-chat-preview__name">
                                        Your conversation
                                    </span>

                                    <span className="landing-chat-preview__status">
                                        Online
                                    </span>
                                </div>
                            </div>

                            <div className="landing-chat-preview__messages">
                                <div className="landing-message landing-message--received">
                                    Hey! How are you?
                                </div>

                                <div className="landing-message landing-message--sent">
                                    I'm good! What about you?
                                </div>

                                <div className="landing-message landing-message--received">
                                    Doing great!
                                </div>
                            </div>

                            <div className="landing-chat-preview__input">
                                <span>Write a message...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="landing-features">
                <div className="landing-container">
                    <div className="landing-section-heading">
                        <p className="landing-eyebrow">Everything you need</p>

                        <h2 className="landing-section-heading__title">
                            A focused way to stay connected.
                        </h2>

                        <p className="landing-section-heading__description">
                            Talkio keeps conversations simple without unnecessary
                            complexity.
                        </p>
                    </div>

                    <div className="landing-features__grid">
                        <article className="landing-feature-card">
                            <div className="landing-feature-card__icon">
                                💬
                            </div>

                            <h3 className="landing-feature-card__title">
                                Private conversations
                            </h3>

                            <p className="landing-feature-card__description">
                                Start one-to-one conversations with people you connect with.
                            </p>
                        </article>

                        <article className="landing-feature-card">
                            <div className="landing-feature-card__icon">
                                ⚡
                            </div>

                            <h3 className="landing-feature-card__title">
                                Real-time messaging
                            </h3>

                            <p className="landing-feature-card__description">
                                Send and receive messages instantly through real-time
                                communication.
                            </p>
                        </article>

                        <article className="landing-feature-card">
                            <div className="landing-feature-card__icon">
                                👥
                            </div>

                            <h3 className="landing-feature-card__title">
                                Stay connected
                            </h3>

                            <p className="landing-feature-card__description">
                                Find friends, manage connections, and keep your conversations
                                in one place.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* Call to action */}
            <section className="landing-cta">
                <div className="landing-container landing-cta__content">
                    <div>
                        <p className="landing-eyebrow">
                            Ready to start?
                        </p>

                        <h2 className="landing-cta__title">
                            Start your first conversation.
                        </h2>
                    </div>

                    <Link
                        to="/register"
                        className="landing-button landing-button--primary"
                    >
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-container landing-footer__inner">
                    <p className="landing-footer__brand">
                        <img
                            src={logo}
                            alt=""
                            className="landing-footer__logo"
                            aria-hidden="true"
                        />
                        <span className="landing-footer__text-mark">Talkio</span>
                    </p>

                    <p className="landing-footer__text">
                        Connect. Talk. Stay close.
                    </p>
                </div>
            </footer>
        </main>
    );
};

export default LandingPage;