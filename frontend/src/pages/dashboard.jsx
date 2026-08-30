import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/authAPI.js";
import { clearAuthSession, resolveErrorMessage } from "../utils/helpers.jsx";

const DashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data } = await getCurrentUser();
                setUser(data.user);
            } catch (requestError) {
                setError(resolveErrorMessage(requestError));
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            await logoutUser();
        } catch {
            // Clear the local session even if the logout request fails.
        } finally {
            clearAuthSession();
            navigate("/login");
            setLoggingOut(false);
        }
    };

    return (
        <main>
            <h1>Dashboard</h1>
            {loading ? <p>Loading...</p> : null}
            {error ? <p>{error}</p> : null}
            {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : null}
            <button type="button" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? "Signing out..." : "Logout"}
            </button>
        </main>
    );
};

export default DashboardPage;
