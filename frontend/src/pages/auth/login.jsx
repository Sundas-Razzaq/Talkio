import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
        <main className="auth-page auth-page--login">
            <section className="auth-card">
                <header className="auth-card__header">
                    <p className="auth-card__eyebrow">
                        Welcome back
                    </p>

                    <h1 className="auth-card__title">
                        Login to Talkio
                    </h1>

                    <p className="auth-card__subtitle">
                        Continue your conversations.
                    </p>
                </header>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="auth-form__field">
                        <label
                            className="auth-form__label"
                            htmlFor="email"
                        >
                            Email
                        </label>

                        <input
                            className="auth-form__input"
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-form__field">
                        <label
                            className="auth-form__label"
                            htmlFor="password"
                        >
                            Password
                        </label>

                        <input
                            className="auth-form__input"
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
                        {loading
                            ? "Signing in..."
                            : "Login"}
                    </button>
                </form>

                <footer className="auth-card__footer">
                    <Link to="/forgot-password">
                        Forgot password?
                    </Link>

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create an account
                    </Link>
                </footer>
            </section>
        </main>
    );
}

export default LoginPage;