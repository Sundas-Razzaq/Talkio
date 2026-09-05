import api from "./axiosInstance.js";

export const getProfile = () =>
    api.get("/user/profile");

export const updateProfile = (payload) =>
    api.patch("/user/profile", payload);

export const uploadProfilePicture = (formData) =>
    api.post("/user/profile/picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const deleteProfilePicture = () =>
    api.delete("/user/profile/picture");

export const searchUserByEmail = (email) =>
    api.get("/user/search", {
        params: { email },
    });