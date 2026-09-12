import { Link } from "react-router-dom";
import { MessageCircle, Users, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import logo from "../../assets/logo.png";

const MotionLink = motion(Link);

const LandingPage = () => {
    const reduceMotion = useReducedMotion();

    const reveal = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: reduceMotion ? 0 : 0.45, ease: "easeOut" },
        },
    };

    const stagger = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: reduceMotion ? 0 : 0.08,
            },
        },
    };

    const featureCard = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: reduceMotion ? 0 : 0.45, ease: "easeOut" },
        },
    };

    return (
        <motion.main
            className="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Navigation */}
            <header className="landing-header">
                <motion.div
                    className="landing-container landing-header__inner"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                >
                    <MotionLink
                        to="/"
                        className="landing-brand"
                        variants={reveal}
                        whileHover={reduceMotion ? undefined : { y: -1 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    >
                        <img
                            src={logo}
                            alt=""
                            className="landing-brand__logo"
                            aria-hidden="true"
                        />
                        <span className="landing-brand__text">Talkio</span>
                    </MotionLink>

                    <motion.nav
                        className="landing-nav"
                        aria-label="Main navigation"
                        variants={stagger}
                    >
                        <MotionLink
                            to="/login"
                            className="landing-nav__link"
                            variants={reveal}
                            whileHover={reduceMotion ? undefined : { y: -1 }}
                            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                        >
                            Login
                        </MotionLink>

                        <MotionLink
                            to="/register"
                            className="landing-nav__link landing-nav__link--primary"
                            variants={reveal}
                            whileHover={reduceMotion ? undefined : { y: -1, scale: 1.02 }}
                            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                        >
                            Get Started
                        </MotionLink>
                    </motion.nav>
                </motion.div>
            </header>

            {/* Hero */}
            <section className="landing-hero">
                <div className="landing-container landing-hero__content">
                    <motion.div
                        className="landing-hero__text"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        <motion.p className="landing-eyebrow" variants={reveal}>
                            Simple. Personal. Real-time.
                        </motion.p>

                        <motion.h1 className="landing-hero__title" variants={reveal}>
                            Stay connected with the people who matter.
                        </motion.h1>

                        <motion.p className="landing-hero__description" variants={reveal}>
                            Talkio gives you a simple place to connect with friends,
                            start private conversations, and chat in real time.
                        </motion.p>

                        <motion.div className="landing-hero__actions" variants={reveal}>
                            <MotionLink
                                to="/register"
                                className="landing-button landing-button--primary"
                                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                            >
                                Create an account
                            </MotionLink>

                            <MotionLink
                                to="/login"
                                className="landing-button landing-button--secondary"
                                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                            >
                                Login
                            </MotionLink>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="landing-hero__visual"
                        aria-hidden="true"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
                    >
                        <motion.div
                            className="landing-chat-preview"
                            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: reduceMotion ? 0 : [0, -5, 0],
                            }}
                            transition={{
                                opacity: { duration: reduceMotion ? 0 : 0.45 },
                                scale: { duration: reduceMotion ? 0 : 0.5, ease: "easeOut" },
                                y: reduceMotion
                                    ? { duration: 0 }
                                    : { duration: 5, repeat: Infinity, ease: "easeInOut" },
                            }}
                        >
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

                            <motion.div
                                className="landing-chat-preview__messages"
                                initial="hidden"
                                animate="visible"
                                variants={stagger}
                            >
                                <motion.div className="landing-message landing-message--received" variants={reveal}>
                                    Hey! How are you?
                                </motion.div>

                                <motion.div className="landing-message landing-message--sent" variants={reveal}>
                                    I'm good! What about you?
                                </motion.div>

                                <motion.div className="landing-message landing-message--received" variants={reveal}>
                                    Doing great!
                                </motion.div>
                            </motion.div>

                            <div className="landing-chat-preview__input">
                                <span>Write a message...</span>
                            </div>
                        </motion.div>
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
                            variants={featureCard}
                            whileHover={reduceMotion ? undefined : { y: -4 }}
                        >
                            <motion.div
                                className="landing-feature-card__icon"
                                whileHover={reduceMotion ? undefined : { rotate: 5, scale: 1.08 }}
                            >
                                <MessageCircle size={22} strokeWidth={1.8} />
                            </motion.div>

                            <h3 className="landing-feature-card__title">
                                Private conversations
                            </h3>

                            <p className="landing-feature-card__description">
                                Start one-to-one conversations with people you connect with.
                            </p>
                        </motion.article>

                        <motion.article
                            className="landing-feature-card"
                            variants={featureCard}
                            whileHover={reduceMotion ? undefined : { y: -4 }}
                        >
                            <motion.div
                                className="landing-feature-card__icon"
                                whileHover={reduceMotion ? undefined : { rotate: 5, scale: 1.08 }}
                            >
                                <Zap size={22} strokeWidth={1.8} />
                            </motion.div>

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
                            variants={featureCard}
                            whileHover={reduceMotion ? undefined : { y: -4 }}
                        >
                            <motion.div
                                className="landing-feature-card__icon"
                                whileHover={reduceMotion ? undefined : { rotate: 5, scale: 1.08 }}
                            >
                                <Users size={22} strokeWidth={1.8} />
                            </motion.div>

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
            <motion.section
                className="landing-cta"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={reveal}
            >
                <div className="landing-container landing-cta__content">
                    <div>
                        <p className="landing-eyebrow">
                            Ready to start?
                        </p>

                        <h2 className="landing-cta__title">
                            Start your first conversation.
                        </h2>
                    </div>

                    <MotionLink
                        to="/register"
                        className="landing-button landing-button--primary"
                        whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    >
                        Get Started
                    </MotionLink>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                className="landing-footer"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
            >
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
            </motion.footer>
        </motion.main>
    );
};

export default LandingPage;