import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import friendController from "../controllers/friend.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
    getFriendsByStatusSchema,
    sendFriendRequestSchema,
} from "../validators/friend.validator.js";

const router = Router();

router.use(authenticate);

// (Private) POST /friends
router.post("/", validate(sendFriendRequestSchema), friendController.sendFriendRequest);

// (Private) GET /friends/suggestions
router.get("/suggestions", friendController.getFriendSuggestions);

// (Private) GET /friends?status="pending"
router.get("/", validate(getFriendsByStatusSchema), friendController.getFriendsByStatus);

// (Private) PATCH /friends/:id/accept
router.patch("/:id/accept", friendController.acceptFriendRequest);

export default router;
