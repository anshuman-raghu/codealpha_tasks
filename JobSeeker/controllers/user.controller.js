import User from "../models/user.model";
import { UploadOnCloudinary } from "../utils/cloudinary";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error);
        throw new Error(`Error while generating Tokens ${error.message}`);
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((f) => f?.trim() === ("" || undefined)))
        throw new Error("Please provide name, email, password ");

    const ExistingUser = await User.findOne({
        email,
    });

    if (ExistingUser) {
        throw new Error("User with thim email already exist");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new Error("Somethins went wrong while registering user");
    }

    return res
        .status(200)
        .data(createdUser)
        .message("User registers Succesfully");
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error("Email and Password are required", { status: 400 });
    }

    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new Error("User does not exist Please registerd first");
    }

    const isValidPass = await user.comparePassword(password);

    if (!isValidPass) {
        throw new Error("Wrong password please try again", {
            status: 402,
        });
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    res.status(202)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .data(loggedInUser, accessToken, refreshToken)
        .message("User logged in ");
};

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );
    return res
        .status(203)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .message("Logout Succesfully");
};

const refreshAccessToken = async (req, res) => {
    const incomingRefToken = req.cookie.refreshToken || req.body.refreshToken;

    if (!incomingRefToken) {
        throw new Error("Unauthorized Request");
    }

    const decodedToken = jwt.verify(
        incomingRefToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = User.findById(decodedToken._id);

    if (!user) {
        throw new Error("Invalid Refresh token ");
    }

    if (user.refreshToken == incomingRefToken) {
        const { refreshToken, accessToken } =
            await generateAccessAndRefreshToken(user._id);
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .message("Access token refreshed");
};

const currentUser = async (req, res) => {
    return res.status(200).data(req.user).message("Current User ");
};
