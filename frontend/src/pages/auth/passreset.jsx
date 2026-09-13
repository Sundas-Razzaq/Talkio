import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AuthPageShell from "../../components/auth/authPageShell.jsx";
import { resetPassword } from "../../api/authAPI.js";
import {
    resolveErrorMessage,
    setAuthSession,
} from "../../utils/helpers.js";

const PasswordResetPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { data } = await resetPassword(token, {
                password,
            });

            setAuthSession({
                token: data.token,
                user: data.user,
            });

            navigate("/dashboard");
        } catch (requestError) {
            setError(resolveErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Reset password"
            title="Choose a new password"
            subtitle="Set a new password for your Talkio account."
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
                        htmlFor="password"
                    >
                        New password
                    </label>

                    <input
                        className="form-field__input"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                <div className="form-field">
                    <label
                        className="form-field__label"
                        htmlFor="confirmPassword"
                    >
                        Confirm password
                    </label>

                    <input
                        className="form-field__input"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        required
                    />
                </div>

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
                        ? "Resetting..."
                        : "Reset password"}
                </button>
            </form>
        </AuthPageShell>
    );
};

export default PasswordResetPage;