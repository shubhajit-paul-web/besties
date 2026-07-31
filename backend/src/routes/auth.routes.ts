import { Router } from "express";
import validate from "../middlewares/validator.middleware.js";
import {
    initiateRegistrationSchema,
    verifyRegistrationOtpSchema,
    loginUserSchema,
} from "../validators/auth.validator.js";
import authController from "../controllers/auth.controller.js";

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

export default router;
