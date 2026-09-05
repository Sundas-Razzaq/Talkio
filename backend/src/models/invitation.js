import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
    {
        inviter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;