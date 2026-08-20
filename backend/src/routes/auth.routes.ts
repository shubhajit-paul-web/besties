import { Router } from "express";
import validate from "../middlewares/validator.middleware.js";
import {
    initiateRegistrationSchema,
    verifyRegistrationOtpSchema,
    loginUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "../validators/auth.validator.js";
import authController from "../controllers/auth.controller.js";
import validateRefreshToken from "../middlewares/refresh.middleware.js";

const router = Router();

// (Public) POST /auth/register/initiate
router.post(
    "/register/initiate",
    validate(initiateRegistrationSchema),
    authController.initiateRegistration,
);

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

// (Public) POST /auth/forgot-password
router.patch("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);

// (Public) PATCH /auth/reset-password
router.patch("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

export default router;
