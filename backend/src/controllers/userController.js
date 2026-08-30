import { validationResult } from "express-validator";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

export const updateProfile = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }

    const { name, bio, profilePicture } = req.body;

    const user = req.user;

    if (name !== undefined) {
        user.name = name;
    }

    if (bio !== undefined) {
        user.bio = bio;
    }

    if (profilePicture !== undefined) {
        user.profilePicture = profilePicture;
    }

    user.profileSetupCompleted = true;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: user.toJSON(),
    });
});