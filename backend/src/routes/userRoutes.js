import express from "express";
import { body } from "express-validator";

import {
    getProfile,
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,
    searchUserByEmail,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.patch(
    "/profile",
    authMiddleware,
    [
        body("name")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Name cannot be empty"),

        body("bio")
            .optional()
            .trim()
            .isLength({ max: 160 })
            .withMessage("Bio cannot exceed 160 characters"),
    ],
    updateProfile
);

router.post(
    "/profile/picture",
    authMiddleware,
    upload.single("profilePicture"),
    uploadProfilePicture
);

router.delete(
    "/profile/picture",
    authMiddleware,
    deleteProfilePicture
);

router.get(
    "/search",
    authMiddleware,
    searchUserByEmail
);

export default router;