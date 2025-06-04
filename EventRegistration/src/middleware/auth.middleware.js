import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = "supersecretjwtkey"; // Should be in environment variables

async function protect(req, res, next) {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res
                    .status(401)
                    .json({ message: "Not authorized, user not found." });
            }
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return res
                .status(401)
                .json({ message: "Not authorized, token failed." });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token." });
    }
}

export { protect };
