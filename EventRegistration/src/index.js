import express from "express";
import { connectToMongoDB } from "./connect.js";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import userRoutes from "./routes/user.route.js";
import eventRoutes from "./routes/event.route.js";
import registrationRoutes from "./routes/registration.route.js";

const app = express();
const PORT = 8004;

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from 'public' directory

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/event-registration");

// API Routes - THESE MUST COME FIRST
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// CATCH-ALL ROUTE - THIS MUST COME LAST
app.get("/", (req, res) => {
    console.log("15");
    res.sendFile(path.join(__dirname, "../public/index.html"));
    console.log("16");
});
app.get("/*splat", (req, res) => {
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
