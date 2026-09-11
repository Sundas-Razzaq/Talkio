import api from "./axiosInstance.js";

export const sendFriendRequest = (recipientId) =>
    api.post("/connections/request", {
        recipientId,
    });

export const getFriendRequests = () =>
    api.get("/connections/requests");

export const respondToFriendRequest = (connectionId, action) =>
    api.patch(`/connections/request/${connectionId}`, {
        action,
    });

export const getFriends = () =>
    api.get("/connections/friends");

export const removeFriend = (friendId) =>
    api.delete(`/connections/friends/${friendId}`);

export const inviteUserByEmail = (email) =>
    api.post("/connections/invite", {
        email,
    });