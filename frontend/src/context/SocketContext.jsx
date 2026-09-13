import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useAuth } from "../hooks/useAuth.js";
import { getStoredToken } from "../utils/helpers.js";
import { SocketContext } from "./socketContext.js";

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function SocketProvider({ children }) {
    const { user } = useAuth();
    const userId = user?._id || null;

    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!userId) {
            return;
        }

        const token = getStoredToken();

        if (!token) {
            return;
        }

        const instance = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket"],
            withCredentials: true,
        });

        // ---- Event handlers (async; setState here is allowed) ----
        const handleConnect = () => {
            setConnected(true);
            setSocket(instance);
            console.log("[socket] connected", instance.id);
        };

        const handleDisconnect = (reason) => {
            setConnected(false);
            console.log("[socket] disconnected", reason);
        };

        const handleConnectError = (err) => {
            setConnected(false);
            console.warn("[socket] connect_error", err.message);
        };

        instance.on("connect", handleConnect);
        instance.on("disconnect", handleDisconnect);
        instance.on("connect_error", handleConnectError);

        // If the socket is already connected by the time we attach
        // (rare but possible with fast reconnects), sync state via
        // a microtask so we don't call setState synchronously here.
        if (instance.connected) {
            queueMicrotask(() => {
                setConnected(true);
                setSocket(instance);
            });
        }

        return () => {
            instance.off("connect", handleConnect);
            instance.off("disconnect", handleDisconnect);
            instance.off("connect_error", handleConnectError);
            instance.disconnect();
            // Note: we don't call setSocket(null) / setConnected(false)
            // synchronously here — that would fire setState from the
            // cleanup during unmount or user change, which the rule
            // still flags. The provider unmounts, so state is discarded
            // anyway. On user change, the next effect's handlers will
            // update state once the new socket connects.
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
}