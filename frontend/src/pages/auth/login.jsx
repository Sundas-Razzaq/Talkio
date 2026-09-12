import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthPageShell from "../../components/auth/authPageShell.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { resolveErrorMessage } from "../../utils/helpers.js";

const initialForm = {
    email: "",
    password: "",
};

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const data = await login(form);

            const destination =
                location.state?.from?.pathname ||
                (data.user.profileSetupCompleted
                    ? "/dashboard"
                    : "/profile/setup");

            navigate(destination, { replace: true });
        } catch (requestError) {
            setError(resolveErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Welcome back"
            title="Login to Talkio"
            subtitle="Continue your conversations."
            footer={
                <>
                    <Link
                        className="auth-link"
                        to="/forgot-password"
                    >
                        Forgot password?
                    </Link>

                    <span className="auth-card__footer-text">
                        Don&apos;t have an account?
                    </span>

                    <Link className="auth-link" to="/register">
                        Create an account
                    </Link>
                </>
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
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-field">
                    <label
                        className="form-field__label"
                        htmlFor="password"
                    >
                        Password
                    </label>

                    <input
                        className="form-field__input"
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
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
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
        </AuthPageShell>
    );
}

export default LoginPage;