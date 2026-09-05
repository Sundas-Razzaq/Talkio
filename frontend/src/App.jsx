import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login.jsx";
import RegisterPage from "./pages/auth/register.jsx";
import ForgotPasswordPage from "./pages/auth/forgotpass.jsx";
import PasswordResetPage from "./pages/auth/passreset.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import ProtectedRoute from "./routes/protectedRoute.jsx";
import { getStoredToken } from "./utils/helpers.js";
import AppRoutes from "./routes/AppRoutes.jsx";

const defaultRoute = getStoredToken() ? "/dashboard" : "/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<PasswordResetPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      <AppRoutes />
    </Routes>
  );
}

export default App;
