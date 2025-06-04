import express from "express";
import {
    registerForEvent,
    getUserRegistrations,
    cancelRegistration,
} from "../controllers/registration.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // Import authentication middleware

const router = express.Router();

router.post("/:eventId", protect, registerForEvent); // Protected route for registering
router.get("/me", protect, getUserRegistrations); // Protected route for user's registrations
router.delete("/:registrationId", protect, cancelRegistration); // Protected route for cancelling

export default router;
