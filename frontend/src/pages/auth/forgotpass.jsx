import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/authAPI.js";
import { resolveErrorMessage } from "../../utils/helpers.jsx";

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
            setMessage(data.message || "Password reset email sent");
        } catch (requestError) {
            setError(resolveErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send reset email"}
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

export default ForgotPasswordPage;
