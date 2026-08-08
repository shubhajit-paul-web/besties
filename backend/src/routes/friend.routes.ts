import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import friendController from "../controllers/friend.controller.js";
import validate from "../middlewares/validator.middleware.js";
import { addFriendSchema } from "../validators/friend.validator.js";

const router = Router();

router.use(authenticate);

// (Private) POST /friends
router.post("/", validate(addFriendSchema), friendController.addFriend);

export default router;
