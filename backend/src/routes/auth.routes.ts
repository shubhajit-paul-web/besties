import { Router } from "express";
import validate from "../middlewares/validator.middleware.js";
import { registerUserSchema } from "../validators/auth.validator.js";
import authController from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

// POST /auth/register
router.post(
    "/register",
    upload.single("avatar"),
    validate(registerUserSchema),
    authController.registerUser,
);

export default router;
