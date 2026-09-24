import { Router } from "express";

import {
    create,
    getAll,
    getById
} from "../controllers/detection.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { processVideo } from "../controllers/detection.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Create a detection
router.post(
    "/",
    authMiddleware,
    create
);

// Get all detections
router.get(
    "/",
    authMiddleware,
    getAll
);

// Get one detection
router.get(
    "/:id",
    authMiddleware,
    getById
);

router.post(
    "/process-video",
    authMiddleware,
    upload.single("video"),
    processVideo
);

export default router;