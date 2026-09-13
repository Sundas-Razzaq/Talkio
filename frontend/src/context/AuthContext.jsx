import { useEffect, useState } from "react";
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../api/authAPI.js";
import { AuthContext } from "./authContext.js";
import {
    clearAuthSession,
    getStoredToken,
    setAuthSession,
} from "../utils/helpers.js";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const token = getStoredToken();

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const { data } = await getCurrentUser();

            setUser(data.user);

            setAuthSession({
                token,
                user: data.user,
            });
        } catch {
            clearAuthSession();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            const token = getStoredToken();

            if (!token) {
                if (!cancelled) {
                    setUser(null);
                    setLoading(false);
                }

                return;
            }

            try {
                const { data } = await getCurrentUser();

                if (!cancelled) {
                    setUser(data.user);

                    setAuthSession({
                        token,
                        user: data.user,
                    });
                }
            } catch {
                if (!cancelled) {
                    clearAuthSession();
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = async (payload) => {
        const { data } = await loginUser(payload);

        setAuthSession({
            token: data.token,
            user: data.user,
        });

        setUser(data.user);

        return data;
    };

    const register = async (payload) => {
        const { data } = await registerUser(payload);

        setAuthSession({
            token: data.token,
            user: data.user,
        });

        setUser(data.user);

        return data;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            clearAuthSession();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}