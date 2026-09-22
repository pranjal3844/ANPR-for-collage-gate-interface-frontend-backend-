import { Router } from "express";

import {
    register,
    login,
    logout,
    refresh,
    getMe,
    changeUserPassword,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);
router.patch(
    "/change-password",
    authMiddleware,
    changeUserPassword
);

export default router;