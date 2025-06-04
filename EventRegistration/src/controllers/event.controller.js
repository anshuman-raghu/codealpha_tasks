import Event from "../models/event.model.js";

async function createEvent(req, res) {
    const { title, description, date, location } = req.body;
    const createdBy = req.user.id; // From auth middleware

    if (!title || !description || !date || !location) {
        return res
            .status(400)
            .json({ message: "All event fields are required." });
    }

    try {
        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            createdBy,
        });
        return res
            .status(201)
            .json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function getAllEvents(req, res) {
    try {
        const events = await Event.find().sort({ date: 1 });
        return res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function getEventById(req, res) {
    try {
        const event = await Event.findById(req.params.id).populate(
            "createdBy",
            "name email"
        );
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        return res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function updateEvent(req, res) {
    const { title, description, date, location } = req.body;
    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Optional: Check if the user updating is the creator of the event
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to update this event.",
            });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;

        const updatedEvent = await event.save();
        return res.status(200).json({
            message: "Event updated successfully",
            event: updatedEvent,
        });
    } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function deleteEvent(req, res) {
    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Optional: Check if the user deleting is the creator of the event
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this event.",
            });
        }

        await Event.deleteOne({ _id: eventId });
        return res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

export { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
