import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import friendController from "../controllers/friend.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
    acceptFriendRequestSchema,
    getFriendsByStatusSchema,
    getFriendshipsByStatusSchema,
    sendFriendRequestSchema,
} from "../validators/friend.validator.js";

const router = Router();

router.use(authenticate);

// (Private) POST /friends/requests
router.post("/requests", validate(sendFriendRequestSchema), friendController.sendFriendRequest);

// (Private) GET /friends/suggestions
router.get("/suggestions", friendController.getFriendSuggestions);

// (Private) GET /friends?status="pending"
router.get("/", validate(getFriendsByStatusSchema), friendController.getFriendsByStatus);

// (Private) PATCH /friends/requests/:id/accept
router.patch(
    "/requests/:id/accept",
    validate(acceptFriendRequestSchema),
    friendController.acceptFriendRequest,
);

// (Private) GET /friends/requests?status="pending"
router.get(
    "/requests",
    validate(getFriendshipsByStatusSchema),
    friendController.getFriendshipsByStatus,
);

export default router;
