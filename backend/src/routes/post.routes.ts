import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validator.middleware.js";
import { createPostSchema, generateFileUploadUrlSchema } from "../validators/post.validator.js";
import postController from "../controllers/post.controller.js";

const router = Router();

router.use(authenticate);

// (Private) POST /posts/file/upload-url
router.post(
    "/file/upload-url",
    validate(generateFileUploadUrlSchema),
    postController.generateFileUploadUrl,
);

// (Private) POST /posts
router.post("/", validate(createPostSchema), postController.createPost);

export default router;
