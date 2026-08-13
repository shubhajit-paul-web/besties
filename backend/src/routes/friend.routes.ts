import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import friendController from "../controllers/friend.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
    friendshipIdSchema,
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

// (Private) PATCH /friends/requests/:friendshipId/accept
router.patch(
    "/requests/:friendshipId/accept",
    validate(friendshipIdSchema),
    friendController.acceptFriendRequest,
);

// (Private) PATCH /friends/requests/:friendshipId/reject
router.patch(
    "/requests/:friendshipId/reject",
    validate(friendshipIdSchema),
    friendController.rejectFriendRequest,
);

// (Private) PATCH /friends/requests/:friendshipId/cancel
router.patch(
    "/requests/:friendshipId/cancel",
    validate(friendshipIdSchema),
    friendController.cancelFriendRequest,
);

// (Private) GET /friends/requests/sent?status="pending"
router.get(
    "/requests/sent",
    validate(getSentFriendshipsByStatusSchema),
    friendController.getSentFriendshipsByStatus,
);

// (Private) GET /friends/requests/received
router.get("/requests/received", friendController.getReceivedFriendRequests);

// (Private) DELETE /friends/:friendshipId
router.delete("/:friendshipId", validate(friendshipIdSchema), friendController.removeFriend);

export default router;
