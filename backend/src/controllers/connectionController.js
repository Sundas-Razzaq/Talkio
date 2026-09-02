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

//Accept request or reject request
export const respondToFriendRequest = asyncHandler(async (req, res, next) => {
    const { connectionId } = req.params;
    const { action } = req.body;

    if (!["accept", "reject"].includes(action)) {
        return next(new ApiError(400, "Invalid action"));
    }

    const connection = await Connection.findOne({
        _id: connectionId,
        recipient: req.user._id,
        status: "pending",
    });

    if (!connection) {
        return next(new ApiError(404, "Pending friend request not found"));
    }

    connection.status = action === "accept" ? "accepted" : "rejected";

    await connection.save();

    return res.status(200).json({
        success: true,
        message:
            action === "accept"
                ? "Friend request accepted successfully"
                : "Friend request rejected successfully",
        connection,
    });
});

// Get all friends of the logged-in user
export const getFriends = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const connections = await Connection.find({
        $or: [
            { requester: userId, status: "accepted" },
            { recipient: userId, status: "accepted" },
        ],
    })
        .populate("requester", "name email profilePicture bio")
        .populate("recipient", "name email profilePicture bio")
        .sort({ updatedAt: -1 });

    const friends = connections.map((connection) => {
        return connection.requester._id.toString() === userId.toString()
            ? connection.recipient
            : connection.requester;
    });

    return res.status(200).json({
        success: true,
        friends,
    });
});