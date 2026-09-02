import Connection from "../models/connection.js";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// Send a friend request to existing talkio user
export const sendFriendRequest = asyncHandler(async (req, res, next) => {
    const { recipientId } = req.body;

    if (!recipientId) {
        return next(new ApiError(400, "Recipient is required"));
    }

    if (recipientId === req.user._id.toString()) {
        return next(new ApiError(400, "You cannot send a request to yourself"));
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
        return next(new ApiError(404, "User not found"));
    }

    const existingConnection = await Connection.findOne({
        requester: req.user._id,
        recipient: recipientId,
    });

    if (existingConnection) {
        return next(new ApiError(400, "Connection request already exists"));
    }

    const reverseConnection = await Connection.findOne({
        requester: recipientId,
        recipient: req.user._id,
    });

    if (reverseConnection) {
        return next(
            new ApiError(400, "This user has already sent you a connection request")
        );
    }

    const connection = await Connection.create({
        requester: req.user._id,
        recipient: recipientId,
    });

    return res.status(201).json({
        success: true,
        message: "Friend request sent successfully",
        connection,
    });
});

// Get all pending friend requests for the logged-in user
export const getPendingRequests = asyncHandler(async (req, res) => {
    const requests = await Connection.find({
        recipient: req.user._id,
        status: "pending",
    })
        .populate("requester", "name email profilePicture bio")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        requests,
    });
});