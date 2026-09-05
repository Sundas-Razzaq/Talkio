import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute() {
    const location = useLocation();
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <main className="route-loading">
                <p>Loading Talkio...</p>
            </main>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (
        !user.profileSetupCompleted &&
        location.pathname !== "/profile/setup"
    ) {
        return (
            <Navigate
                to="/profile/setup"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;