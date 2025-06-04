import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // Import authentication middleware

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile); // Protected route

export default router;
