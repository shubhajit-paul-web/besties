import { StatusCodes } from "http-status-codes";
import type { PostDocument } from "../models/post.model.js";
import type {
    CreatePostPayload,
    PostStatus,
    SupportedFileType,
    UpdatePostPayload,
} from "../types/post/post.types.js";
import ApiError from "../utils/apiError.js";
import storageService from "./storage.service.js";
import friendRepository from "../repositories/friend.repository.js";
import postRepository from "../repositories/post.repository.js";
import getFriendRelations from "../utils/getFriendRelations.js";
import { FEED_CONFIG } from "../constants/post.constants.js";
import _ from "lodash";

// Check that the post exists, belongs to the user, and is not already in the target state.
const getPostAndValidateOwnership = async (
    userId: string,
    postId: string,
    targetStatus: PostStatus,
) => {
    const post = await postRepository.findById(postId, "user status");

    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Post not found or has been removed.");
    }

    if (post.user?.toString() !== userId) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You do not have permission to modify this post.",
        );
    }

    if (post.status === targetStatus) {
        throw new ApiError(StatusCodes.CONFLICT, `Post is already ${targetStatus}.`);
    }

    return post;
};

// Add a safe file link for each post so the user can open files without breaking the whole list.
const attachDownloadUrlsToPosts = async (posts: PostDocument[]) => {
    return Promise.all(
        posts.map(async (currentPost) => {
            const files = currentPost.files;

            if (files.length === 0) return currentPost;

            // Make file links one by one and keep going even if one file fails.
            const fileDownloadOutcomes = await Promise.allSettled(
                files.map((file) => storageService.downloadFile(file.path)),
            );

            return {
                ...currentPost,

                // Keep the file order the same so the app still matches each file with its type.
                files: fileDownloadOutcomes.map((outcome, index) => {
                    return {
                        path: outcome.status === "fulfilled" ? outcome.value : null,
                        contentType: files[index].contentType,
                    };
                }),
            };
        }),
    );
};

// Create a short upload link so the user can send a file to storage.
const generateFileUploadUrl = async (userId: string, contentType: SupportedFileType) => {
    const result = await storageService.createPresignedPostUpload({
        userId,
        path: `posts/${userId}`,
        type: contentType,
        expires: 15 * 60, // 15 minutes
        maxFileSize: 100 * 1024 * 1024, // 100 MB
        acl: "private",
    });

    return result;
};

// Save a new post with the logged-in user as the owner.
const createPost = async (userId: string, payload: CreatePostPayload) => {
    return postRepository.create(userId, payload);
};

// Update a post only if it belongs to the current user.
const updatePost = async (userId: string, postId: string, payload: UpdatePostPayload) => {
    const post = await postRepository.findById(postId, "user");

    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Post not found or has been removed.");
    }

    const isOwner = post.user?.toString() === userId;

    if (!isOwner) {
        throw new ApiError(StatusCodes.FORBIDDEN, "You don't have permission to edit this post.");
    }

    return postRepository.updateById(postId, payload);
};

// Move a post to archive when the owner asks to hide it.
const archivePost = async (userId: string, postId: string) => {
    const post = await getPostAndValidateOwnership(userId, postId, "archived");

    await postRepository.updateStatusById(post._id.toString(), "archived", "archivedAt");
};

// Mark a post as deleted when the owner wants to remove it from normal view.
const deletePost = async (userId: string, postId: string) => {
    const post = await getPostAndValidateOwnership(userId, postId, "deleted");

    await postRepository.updateStatusById(post._id.toString(), "deleted", "deletedAt");
};

// Bring a hidden post back to normal use for the owner.
const restorePost = async (userId: string, postId: string) => {
    const post = await getPostAndValidateOwnership(userId, postId, "active");

    await postRepository.restoreById(post._id.toString());
};

// Get all posts for one user in a chosen state, newest first.
const getMyPostsByStatus = async (userId: string, status: PostStatus = "active") => {
    const posts = await postRepository.findByUserAndStatus(userId, status);

    if (posts.length === 0) return [];

    const postsWithDownloadUrls = await attachDownloadUrlsToPosts(posts);

    return postsWithDownloadUrls;
};

// Show profile posts based on who is looking and what they are allowed to see.
const getProfilePosts = async (viewerId: string, profileUserId: string) => {
    if (viewerId === profileUserId) {
        return await getMyPostsByStatus(viewerId, "active");
    }

    const isFriend = await friendRepository.existsFriendship(viewerId, profileUserId, "accepted");

    if (isFriend) {
        const posts = await postRepository.findProfilePosts(profileUserId, ["public", "friends"]);

        return posts;
    }

    const posts = await postRepository.findProfilePosts(profileUserId, "public");

    return await attachDownloadUrlsToPosts(posts);
};

// Build the home feed with public, own, and friend posts in a mixed order.
const generateUserFeed = async (userId: string) => {
    // Get the user's accepted friends
    const friendships = await friendRepository.findFriendshipsByStatus({
        currentUserId: userId,
        status: "accepted",
    });

    const friendIds = getFriendRelations(userId, friendships).map(({ friendId }) =>
        friendId.toString(),
    );

    /* 
        Fetch posts the user is allowed to see:
        -> public posts
        -> own posts 
        -> posts from friends
    */
    const posts = await postRepository.findFeedPosts(userId, friendIds, FEED_CONFIG.maxPosts);

    // const friendPosts = [];
    // const publicPosts = [];

    // // Separate friend/own posts from public discovery posts
    // for (const post of posts) {
    //     const isOwnPost = post.user._id.toString() === userId;

    //     if (isOwnPost || post.visibility === "friends") {
    //         friendPosts.push(post);
    //     } else {
    //         publicPosts.push(post);
    //     }
    // }

    // const personalizedPosts = [];

    // let friendPostIndex = 0;
    // let publicPostIndex = 0;

    // // Mix N friend posts with 1 public post for discovery
    // while (friendPostIndex < friendPosts.length || publicPostIndex < publicPosts.length) {
    //     for (
    //         let count = 0;
    //         count < FEED_CONFIG.friendPostsPerPublicPost && friendPostIndex < friendPosts.length;
    //         count++
    //     ) {
    //         personalizedPosts.push(friendPosts[friendPostIndex++]);
    //     }

    //     if (publicPostIndex < publicPosts.length) {
    //         personalizedPosts.push(publicPosts[publicPostIndex++]);
    //     }
    // }

    const feedPostsWithDownloadUrls = _.shuffle(await attachDownloadUrlsToPosts(posts));

    return feedPostsWithDownloadUrls;
};

export default {
    createPost,
    generateFileUploadUrl,
    updatePost,
    archivePost,
    deletePost,
    restorePost,
    getMyPostsByStatus,
    getProfilePosts,
    generateUserFeed,
};
