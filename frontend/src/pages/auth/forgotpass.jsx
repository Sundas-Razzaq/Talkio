import { useState } from "react";
import { Link } from "react-router-dom";

import AuthPageShell from "../../components/auth/authPageShell.jsx";
import { forgotPassword } from "../../api/authAPI.js";
import { resolveErrorMessage } from "../../utils/helpers.js";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const { data } = await forgotPassword({ email });
            setMessage(
                data.message || "Password reset email sent"
            );
        } catch (requestError) {
            setError(resolveErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Forgot password"
            title="Reset your password"
            subtitle="Enter your account email and we'll send you a reset link."
            footer={
                <Link className="auth-link" to="/login">
                    Back to login
                </Link>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label
                        className="form-field__label"
                        htmlFor="email"
                    >
                        Email
                    </label>

                    <input
                        className="form-field__input"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                {message ? (
                    <p className="form-message form-message--success">
                        {message}
                    </p>
                ) : null}

                {error ? (
                    <p className="form-message form-message--error">
                        {error}
                    </p>
                ) : null}

                <button
                    className="button button--primary auth-form__submit"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Sending..."
                        : "Send reset email"}
                </button>
            </form>
        </AuthPageShell>
    );
};

export default ForgotPasswordPage;