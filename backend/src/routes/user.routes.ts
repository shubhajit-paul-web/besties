import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";
import validate from "../middlewares/validator.middleware.js";
import { generateAvatarUploadUrlSchema, updateAvatarSchema } from "../validators/user.validator.js";

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

// (Private) PATCH /users/me/avatar
router.patch("/me/avatar", validate(updateAvatarSchema), userController.updateAvatar);

export default router;
