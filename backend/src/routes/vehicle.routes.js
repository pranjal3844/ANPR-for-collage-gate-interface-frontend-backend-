import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/vehicle.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// Any logged-in user
router.get("/", authMiddleware, getAll);
router.get("/:id", authMiddleware, getById);

// Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  create
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  remove
);

export default router;