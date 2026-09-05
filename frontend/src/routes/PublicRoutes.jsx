import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

function PublicRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <main className="route-loading">
                <p>Loading Talkio...</p>
            </main>
        );
    }

    if (user) {
        if (!user.profileSetupCompleted) {
            return (
                <Navigate
                    to="/profile/setup"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
}

export default PublicRoute;