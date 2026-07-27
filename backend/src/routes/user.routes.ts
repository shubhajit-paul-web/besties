import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";

const router = Router();

// (Private) GET /users/me
router.get("/me", authenticate, userController.getCurrentUser);

export default router;
