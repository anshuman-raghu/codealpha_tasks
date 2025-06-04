import jwt from "jsonwebtoken";
import User from "../models/user.model";

const verifyJWT = async (req, res, next) => {
    try {
        const token =
            res.cookies?.accessToken ||
            req.headers["Authorization"]?.replace("Bearer ", "");

        if (!token) {
            throw new Error("Please login ...");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select(
            "-password -refreshtoken"
        );

        if (!user) {
            throw new Error("Unable to find User for this access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new Error(`Invalid access ${error.message}`, {
            status: 401,
        });
    }
};
