import { Link } from "react-router-dom";
import { MessageCircle, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
const LandingPage = () => {
    return (
        <motion.main
            className="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
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
                    <motion.div
                        className="landing-hero__text"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
                    >
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
                    </motion.div>

                    <motion.div
                        className="landing-hero__visual"
                        aria-hidden="true"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
                    >
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
                    </motion.div>
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

                    <motion.div
                        className="landing-features__grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.08 } },
                        }}
                    >
                        <motion.article
                            className="landing-feature-card"
                            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="landing-feature-card__icon">
                                <MessageCircle size={22} strokeWidth={1.8} />
                            </div>

                            <h3 className="landing-feature-card__title">
                                Private conversations
                            </h3>

                            <p className="landing-feature-card__description">
                                Start one-to-one conversations with people you connect with.
                            </p>
                        </motion.article>

                        <motion.article
                            className="landing-feature-card"
                            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="landing-feature-card__icon">
                                <Zap size={22} strokeWidth={1.8} />
                            </div>

                            <h3 className="landing-feature-card__title">
                                Real-time messaging
                            </h3>

                            <p className="landing-feature-card__description">
                                Send and receive messages instantly through real-time
                                communication.
                            </p>
                        </motion.article>

                        <motion.article
                            className="landing-feature-card"
                            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="landing-feature-card__icon">
                                <Users size={22} strokeWidth={1.8} />
                            </div>

                            <h3 className="landing-feature-card__title">
                                Stay connected
                            </h3>

                            <p className="landing-feature-card__description">
                                Find friends, manage connections, and keep your conversations
                                in one place.
                            </p>
                        </motion.article>
                    </motion.div>
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
        </motion.main>
    );
};

export default LandingPage;