import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import messageController from "../controllers/message.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
    friendIdSchema,
    generateFileDownloadUrlSchema,
    generateFileUploadUrlSchema,
} from "../validators/message.validator.js";

const router = Router();

router.use(authenticate);

// (Private) GET /messages/:friendId
router.get("/:friendId", validate(friendIdSchema), messageController.getMessages);

// (Private) POST /messages/file/upload-url
router.post(
    "/file/upload-url",
    validate(generateFileUploadUrlSchema),
    messageController.generateFileUploadUrl,
);

// (Private) POST /messages/file/download-url
router.post(
    "/file/download-url",
    validate(generateFileDownloadUrlSchema),
    messageController.generateFileDownloadUrl,
);

export default router;
