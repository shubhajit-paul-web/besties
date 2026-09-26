import PostModel from "../models/post.model.js";
import type { CreatePostPayload, PostStatus, UpdatePostPayload } from "../types/post/post.types.js";

/** Creates a new post for a user.
 * @param userId ID of the post owner.
 * @param payload Post data to save.
 * @returns The created post document.
 */
const create = async (userId: string, payload: CreatePostPayload) => {
    return PostModel.create({
        ...payload,
        user: userId,
    });
};

/** Finds one post by its ID.
 * @param postId ID of the post to find.
 * @param fields Optional fields to return.
 * @returns The post, or null when it does not exist.
 */
const findById = async (postId: string, fields?: string) => {
    const query = PostModel.findById(postId);

    if (fields) {
        query.select(fields);
    }

    return query.lean();
};

/** Updates a post and returns the updated document.
 * @param postId ID of the post to update.
 * @param payload Values to update.
 * @returns The updated post, or null when it does not exist.
 */
const updateById = async (postId: string, payload: UpdatePostPayload) => {
    return PostModel.findByIdAndUpdate(postId, payload, {
        new: true,
        runValidators: true,
    });
};

/** Changes a post status and optionally records its status time.
 * @param postId ID of the post to update.
 * @param status New status for the post.
 * @param timestampField Field to set to the current time.
 * @returns The update result.
 */
const updateStatusById = async (
    postId: string,
    status: PostStatus,
    timestampField?: "archivedAt" | "deletedAt",
) => {
    return PostModel.updateOne(
        { _id: postId },
        {
            $set: { status },
            ...(timestampField && {
                $currentDate: { [timestampField]: true },
            }),
        },
    );
};

/** Restores a post to the active state.
 * @param postId ID of the post to restore.
 * @returns The update result.
 */
const restoreById = async (postId: string) => {
    return PostModel.updateOne(
        { _id: postId },
        {
            $set: {
                status: "active",
                archivedAt: null,
                deletedAt: null,
            },
        },
    );
};

/** Finds a user's posts with the requested status.
 * @param userId ID of the post owner.
 * @param status Status to match.
 * @returns Matching posts, newest first.
 */
const findByUserAndStatus = async (userId: string, status: PostStatus) => {
    return PostModel.find({
        user: userId,
        status,
    })
        .sort({ createdAt: -1 })
        .lean();
};

/** Finds active posts shown on a user's profile.
 * @param userId ID of the profile owner.
 * @param visibility Visibility values allowed on the profile.
 * @returns Matching profile posts.
 */
const findProfilePosts = async (
    userId: string,
    visibility: "public" | "friends" | ["public", "friends"],
) => {
    return PostModel.find({
        user: userId,
        visibility: Array.isArray(visibility) ? { $in: visibility } : visibility,
        status: "active",
    }).lean();
};

/** Finds active posts for a user's feed.
 * @param userId ID of the user viewing the feed.
 * @param friendIds IDs of the user's friends.
 * @param limit Maximum number of posts to return.
 * @returns Feed posts with basic user details, newest first.
 */
const findFeedPosts = async (userId: string, friendIds: string[], limit: number) => {
    return PostModel.find({
        status: "active",
        $or: [
            { visibility: "public" },
            { user: userId },
            {
                visibility: "friends",
                user: {
                    $in: friendIds,
                },
            },
        ],
    })
        .populate("user", "avatar username name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
};

export default {
    create,
    findById,
    updateById,
    updateStatusById,
    restoreById,
    findByUserAndStatus,
    findProfilePosts,
    findFeedPosts,
};
