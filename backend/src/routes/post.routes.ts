import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validator.middleware.js";
import {
    createPostSchema,
    generateFileUploadUrlSchema,
    postIdSchema,
    updatePostSchema,
} from "../validators/post.validator.js";
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

// (Private) PATCH /posts/:postId
router.patch("/:postId", validate(updatePostSchema), postController.updatePost);

// (Private) DELETE /posts/:postId
router.delete("/:postId", validate(postIdSchema), postController.deletePost);

// (Private) PATCH /posts/:postId/archive
router.patch("/:postId/archive", validate(postIdSchema), postController.archivePost);

// (Private) PATCH /posts/:postId/restore
router.patch("/:postId/restore", validate(postIdSchema), postController.restorePost);

export default router;
