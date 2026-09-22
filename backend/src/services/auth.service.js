import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

//register user
const registerUser = async ({ name, email, password, role }) => {
    // 1. Validate required fields
    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required");
    }

    // 2. Check whether user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User already exists with this email");
    }

    // 3. Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || "SECURITY_USER",
    });

    // 4. Don't return password
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return createdUser;
};

//login user
const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return {
        user: loggedInUser,
        accessToken,
        refreshToken,
    };
};

//logout user
const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: null,
            },
        },
        {
            new: true,
        }
    );

    return true;
};

//refresh access token
const refreshAccessToken = async (incomingRefreshToken) => {
    if (!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is expired or already used");
    }

    const newAccessToken = user.generateAccessToken();

    return newAccessToken;
};

//get current user profile
const getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

//change password
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }

    user.password = newPassword;

    await user.save();

    return true;
};



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
};