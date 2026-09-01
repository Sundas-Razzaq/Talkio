import { validationResult } from "express-validator";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { uploadImage, deleteImage } from "../services/cloudinaryService.js";

// Get user profile
export const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user.toJSON(),
    });
});

//Upload user profile picture
export const uploadProfilePicture = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ApiError(400, "Please upload an image"));
    }

    const user = req.user;

    const result = await uploadImage(
        req.file.buffer,
        "talkio/profiles"
    );

    // Delete previous profile picture from Cloudinary
    if (user.profilePicture?.publicId) {
        await deleteImage(user.profilePicture.publicId);
    }

    user.profilePicture = {
        url: result.secure_url,
        publicId: result.public_id,
    };

    user.profileSetupCompleted = true;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        user: user.toJSON(),
    });
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }

    const { name, bio } = req.body;

    const user = req.user;

    if (name !== undefined) {
        user.name = name;
    }

    if (bio !== undefined) {
        user.bio = bio;
    }

    user.profileSetupCompleted = true;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: user.toJSON(),
    });
});

// Delete user profile picture
export const deleteProfilePicture = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user.profilePicture?.publicId) {
        return res.status(200).json({
            success: true,
            message: "No profile picture to delete",
            user: user.toJSON(),
        });
    }

    await deleteImage(user.profilePicture.publicId);

    user.profilePicture = {
        url: null,
        publicId: null,
    };

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Profile picture deleted successfully",
        user: user.toJSON(),
    });
});