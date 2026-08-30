import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/authAPI.js";
import { resolveErrorMessage, setAuthSession } from "../utils/helpers.jsx";

const PasswordResetPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { data } = await resetPassword(token, { password });
            setAuthSession({ token: data.token, user: data.user });
            setMessage("Password reset successful");
            navigate("/dashboard");
        } catch (requestError) {
            setError(resolveErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">New password</label>
                    <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Resetting..." : "Reset password"}
                </button>
            </form>
            {message ? <p>{message}</p> : null}
            {error ? <p>{error}</p> : null}
            <p>
                <Link to="/login">Back to login</Link>
            </p>
        </main>
    );
};

export default PasswordResetPage;
