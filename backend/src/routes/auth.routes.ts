import { Router } from "express";
import validate from "../middlewares/validator.middleware.js";
import {
    initiateRegistrationSchema,
    verifyRegistrationOtpSchema,
    loginUserSchema,
} from "../validators/auth.validator.js";
import authController from "../controllers/auth.controller.js";
import validateRefreshToken from "../middlewares/refresh.middleware.js";

const router = Router();

// (Public) POST /auth/register
router.post("/register", validate(initiateRegistrationSchema), authController.initiateRegistration);

// (Public) POST /auth/register/verify
router.post(
    "/register/verify",
    validate(verifyRegistrationOtpSchema),
    authController.verifyRegistrationOtp,
);

// (Public) POST /auth/login
router.post("/login", validate(loginUserSchema), authController.loginUser);

// (Private) POST /auth/logout
router.post("/logout", authController.logout);

// (Private) POST /auth/refresh
router.post("/refresh", validateRefreshToken, authController.refreshTokens);

export default router;
