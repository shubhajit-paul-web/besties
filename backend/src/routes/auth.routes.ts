import { Router } from "express";
import validate from "../middlewares/validator.middleware.js";
import { registerUserSchema } from "../validators/auth.validator.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register
router.post("/register", validate(registerUserSchema), authController.registerUser);

export default router;
