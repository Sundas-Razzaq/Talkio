import api from "./axiosInstance.js";

export const getOrCreateConversation = (friendId) =>
    api.post(`/conversations/with/${friendId}`);

export const getConversations = () =>
    api.get("/conversations");

export const getMessages = (conversationId) =>
    api.get(`/conversations/${conversationId}/messages`);