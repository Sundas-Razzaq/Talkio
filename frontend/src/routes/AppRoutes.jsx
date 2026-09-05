import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "../pages/landing/LandingPage.jsx";

import LoginPage from "../pages/auth/login.jsx";
import RegisterPage from "../pages/auth/register.jsx";
import ForgotPasswordPage from "../pages/auth/forgotpass.jsx";
import PasswordResetPage from "../pages/auth/passreset.jsx";

import ProfileSetupPage from "../pages/profile/ProfileSetupPage.jsx";

import DashboardPage from "../pages/dashboard/DashboardPage.jsx";

import ProtectedRoute from "./protectedRoute.jsx";
import PublicRoute from "./PublicRoutes.jsx";

function AppRoutes() {
    return (
        <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Public */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />
                <Route
                    path="/reset-password/:token"
                    element={<PasswordResetPage />}
                />
            </Route>

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route
                    path="/profile/setup"
                    element={<ProfileSetupPage />}
                />

                <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default AppRoutes;