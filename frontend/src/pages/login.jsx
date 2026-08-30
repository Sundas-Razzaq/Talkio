import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authAPI.js";
import { resolveErrorMessage, setAuthSession } from "../utils/helpers.jsx";

const initialForm = {
    email: "",
    password: "",
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await loginUser(form);
            setAuthSession({ token: data.token, user: data.user });
            navigate("/dashboard");
        } catch (requestError) {
            setError(resolveErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
            {error ? <p>{error}</p> : null}
            <p>
                <Link to="/register">Register</Link> | <Link to="/forgot-password">Forgot password</Link>
            </p>
        </main>
    );
};

export default LoginPage;
