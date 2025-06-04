import express from "express";
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} from "../controllers/event.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // Import authentication middleware

const router = express.Router();

router.post("/", protect, createEvent); // Protected route for creating events
router.get("/", getAllEvents); // Public route to get all events
router.get("/:id", getEventById); // Public route to get a single event by ID
router.put("/:id", protect, updateEvent); // Protected route for updating events
router.delete("/:id", protect, deleteEvent); // Protected route for deleting events

export default router;
