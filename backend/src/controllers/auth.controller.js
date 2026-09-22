import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
} from "../services/auth.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await registerUser({
        name,
        email,
        password,
        role,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                user,
                "User registered successfully"
            )
        );
});


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const {
        user,
        accessToken,
        refreshToken,
    } = await loginUser({
        email,
        password,
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
    };

    res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user,
                    accessToken,
                },
                "Login successful"
            )
        );
});


const logout = asyncHandler(async (req, res) => {
    await logoutUser(req.user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
    };

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                null,
                "Logout successful"
            )
        );
});


const refresh = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(
            401,
            "Refresh token is missing"
        );
    }

    const accessToken = await refreshAccessToken(
        incomingRefreshToken
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "Access token refreshed successfully"
            )
        );
});


const getMe = asyncHandler(async (req, res) => {
    const user = await getCurrentUser(req.user._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User fetched successfully"
            )
        );
});

const changeUserPassword = asyncHandler(async (req, res) => {
    const {
        oldPassword,
        newPassword,
    } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(
            400,
            "Old password and new password are required"
        );
    }

    await changePassword(
        req.user._id,
        oldPassword,
        newPassword
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Password changed successfully"
            )
        );
});


export {
    register,
    login,
    logout,
    refresh,
    getMe,
    changeUserPassword,
};