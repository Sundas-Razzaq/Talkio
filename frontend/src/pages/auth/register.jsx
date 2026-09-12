import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthPageShell from "../../components/auth/authPageShell.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { resolveErrorMessage } from "../../utils/helpers.js";

const initialForm = {
    name: "",
    email: "",
    password: "",
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

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
            await register(form);
            navigate("/profile/setup");
        } catch (requestError) {
            setError(resolveErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Join Talkio"
            title="Create your account"
            subtitle="Create your Talkio account and start connecting with friends."
            footer={
                <p className="auth-card__footer-text">
                    Already have an account?{" "}
                    <Link className="auth-link" to="/login">
                        Log in
                    </Link>
                </p>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label
                        className="form-field__label"
                        htmlFor="name"
                    >
                        Name
                    </label>

                    <input
                        className="form-field__input"
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                    {loading
                        ? "Creating account..."
                        : "Create account"}
                </button>
            </form>
        </AuthPageShell>
    );
};

export default RegisterPage;