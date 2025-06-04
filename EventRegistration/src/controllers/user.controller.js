import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretjwtkey";

async function registerUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "User with this email already exists." });
        }

        const newUser = await User.create({ name, email, password });
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Logged in successfully",
            token,
            userId: user._id,
        });
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function getUserProfile(req, res) {
    try {
        // req.user is populated by the auth middleware
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

export { registerUser, loginUser, getUserProfile };
