import { Router } from "express";
import validate from "../middlewares/validator.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { registerUserSchema, loginUserSchema } from "../validators/auth.validator.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

// (Public) POST /auth/register
router.post(
    "/register",
    upload.single("avatar"),
    validate(registerUserSchema),
    authController.registerUser,
);

// (Public) POST /auth/login
router.post("/login", validate(loginUserSchema), authController.loginUser);

export default router;
