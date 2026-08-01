import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";
import validate from "../middlewares/validator.middleware.js";
import { generateAvatarUploadUrlSchema } from "../validators/user.validator.js";

const router = Router();

router.use(authenticate);

// (Private) GET /users/me
router.get("/me", userController.getCurrentUser);

// (Private) POST /users/me/avatar/upload-url
router.post(
    "/me/avatar/upload-url",
    validate(generateAvatarUploadUrlSchema),
    userController.generateAvatarUploadUrl,
);

export default router;
