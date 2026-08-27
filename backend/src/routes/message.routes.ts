import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import messageController from "../controllers/message.controller.js";
import validate from "../middlewares/validator.middleware.js";
import { friendIdSchema } from "../validators/message.validator.js";

const router = Router();

router.use(authenticate);

// (Private) GET /messages/:friendId
router.get("/:friendId", validate(friendIdSchema), messageController.getMessages);

export default router;
