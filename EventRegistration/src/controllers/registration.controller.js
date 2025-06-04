import Registration from "../models/registration.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";

async function registerForEvent(req, res) {
    const eventId = req.params.eventId;
    const userId = req.user.id; // From auth middleware

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        const existingRegistration = await Registration.findOne({
            user: userId,
            event: eventId,
        });
        if (existingRegistration) {
            return res.status(409).json({
                message: "You are already registered for this event.",
            });
        }

        const newRegistration = await Registration.create({
            user: userId,
            event: eventId,
        });
        return res.status(201).json({
            message: "Successfully registered for the event.",
            registration: newRegistration,
        });
    } catch (error) {
        console.error("Error during event registration:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function getUserRegistrations(req, res) {
    const userId = req.user.id; // From auth middleware

    try {
        const registrations = await Registration.find({ user: userId })
            .populate("event", "title description date location") // Populate event details
            .sort({ registrationDate: -1 });

        return res.status(200).json(registrations);
    } catch (error) {
        console.error("Error fetching user registrations:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function cancelRegistration(req, res) {
    const registrationId = req.params.registrationId;
    const userId = req.user.id; // From auth middleware

    try {
        const registration = await Registration.findById(registrationId);
        if (!registration) {
            return res.status(404).json({ message: "Registration not found." });
        }

        // Ensure the user cancelling the registration is the one who made it
        if (registration.user.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to cancel this registration.",
            });
        }

        await Registration.deleteOne({ _id: registrationId });
        return res
            .status(200)
            .json({ message: "Registration cancelled successfully." });
    } catch (error) {
        console.error("Error cancelling registration:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

export { registerForEvent, getUserRegistrations, cancelRegistration };
