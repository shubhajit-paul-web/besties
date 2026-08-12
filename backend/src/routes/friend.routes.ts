import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import friendController from "../controllers/friend.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
    acceptFriendRequestSchema,
    getFriendsByStatusSchema,
    getSentFriendshipsByStatusSchema,
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

// (Private) GET /friends/requests/sent?status="pending"
router.get(
    "/requests",
    validate(getSentFriendshipsByStatusSchema),
    friendController.getSentFriendshipsByStatus,
);

// (Private) GET /friends/requests/received
router.get("/requests/received", friendController.getReceivedFriendRequests);

export default router;
