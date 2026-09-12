import { motion } from "framer-motion";

const AuthPageShell = ({
    eyebrow,
    title,
    subtitle,
    children,
    footer,
}) => {
    return (
        <motion.main
            className="auth-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <motion.section
                className="auth-hero"
                aria-hidden="true"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >
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
            </motion.section>

            <motion.section
                className="auth-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
            >
                <div className="auth-card__header">
                    <p className="eyebrow">{eyebrow}</p>

                    <h2 className="auth-card__title">{title}</h2>

                    <p className="auth-card__subtitle">{subtitle}</p>
                </div>

                {children}

                {footer ? (
                    <div className="auth-card__footer">{footer}</div>
                ) : null}
            </motion.section>
        </motion.main>
    );
};

export default AuthPageShell;