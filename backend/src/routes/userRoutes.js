import express from "express";

import { body } from "express-validator";

import { updateProfile } from "../controllers/userController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

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

        body("profilePicture")
            .optional()
            .isURL()
            .withMessage("Profile picture must be a valid URL"),
    ],
    updateProfile
);

export default router;