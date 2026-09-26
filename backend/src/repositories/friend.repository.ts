import FriendModel, { type FriendDocument } from "../models/friend.model.js";
import type { FindFriendshipsByStatus } from "../types/friend/friend.repository.js";
import type { QueryFilter, Types } from "mongoose";

/** Creates a new friend request.
 *
 * @param {string} senderId - The ID of the user sending the request.
 * @param {string} receiverId - The ID of the user receiving the request.
 * @returns {Promise<any>} A promise resolving to the created friendship.
 */
const create = async (senderId: string, receiverId: string) => {
    return FriendModel.create({
        sender: senderId,
        receiver: receiverId,
    });
};

/** Finds the friendship between two users.
 *
 * @param {string} senderId - The ID of the first user.
 * @param {string} receiverId - The ID of the second user.
 * @param {string} [fields] - Fields to return from the friendship.
 * @returns {Promise<any>} A promise resolving to the friendship, or null.
 */
const findRelationshipBetweenUsers = async (
    senderId: string,
    receiverId: string,
    fields: string = "sender status +rejectedAt +rejectionExpiresAt",
) => {
    return FriendModel.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
        ],
    })
        .select(fields)
        .lean();
};

/** Deletes a friendship when its ID and status match.
 *
 * @param {string | Types.ObjectId} friendshipId - The friendship ID.
 * @param {FriendDocument["status"]} status - The status to match.
 * @returns {Promise<any>} A promise resolving to the delete result.
 */
const deleteFriendshipByIdAndStatus = async (
    friendshipId: string | Types.ObjectId,
    status: FriendDocument["status"],
) => {
    return FriendModel.deleteOne({
        _id: friendshipId,
        status,
    });
};

/** Deletes a friendship by its ID.
 *
 * @param {string | Types.ObjectId} friendshipId - The friendship ID.
 * @returns {Promise<any>} A promise resolving to the delete result.
 */
const deleteFriendshipById = async (friendshipId: string | Types.ObjectId) => {
    return FriendModel.deleteOne({ _id: friendshipId });
};

/** Finds a user's friendships, optionally filtered by status.
 *
 * @param {FindFriendshipsByStatus} options - User ID, status, and fields to return.
 * @returns {Promise<any[]>} A promise resolving to matching friendships.
 */
const findFriendshipsByStatus = async ({
    currentUserId,
    status,
    fields = "sender receiver -_id",
}: FindFriendshipsByStatus) => {
    const filter: QueryFilter<FriendDocument> = {
        $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    };

    if (status) {
        filter.status = status;
    }

    return FriendModel.find(filter).select(fields).lean();
};

/** Changes the status of a friendship.
 *
 * @param {string} friendshipId - The friendship ID.
 * @param {FriendDocument["status"]} status - The new friendship status.
 * @returns {Promise<any>} A promise resolving to the update result.
 */
const updateStatusById = async (friendshipId: string, status: FriendDocument["status"]) => {
    return FriendModel.updateOne(
        {
            _id: friendshipId,
        },
        {
            $set: { status },
        },
    );
};

/** Finds a friendship by its ID.
 *
 * @param {string} friendshipId - The friendship ID.
 * @param {string} [fields="-createdAt -updatedAt"] - Fields to return.
 * @returns {Promise<any>} A promise resolving to the friendship, or null.
 */
const findFriendshipById = async (
    friendshipId: string,
    fields: string = "-createdAt -updatedAt",
) => {
    return FriendModel.findById(friendshipId).select(fields).lean();
};

/** Finds a friendship by ID and receiver ID.
 *
 * @param {string} friendshipId - The friendship ID.
 * @param {string} receiverId - The receiver's user ID.
 * @param {string} [fields="-createdAt -updatedAt"] - Fields to return.
 * @returns {Promise<any>} A promise resolving to the friendship, or null.
 */
const findFriendshipByIdAndReceiver = async (
    friendshipId: string,
    receiverId: string,
    fields: string = "-createdAt -updatedAt",
) => {
    return FriendModel.findOne({
        _id: friendshipId,
        receiver: receiverId,
    })
        .select(fields)
        .lean();
};

/** Finds a friendship by ID and sender ID.
 *
 * @param {string} friendshipId - The friendship ID.
 * @param {string} senderId - The sender's user ID.
 * @param {string} [fields="status"] - Fields to return.
 * @returns {Promise<any>} A promise resolving to the friendship, or null.
 */
const findFriendshipByIdAndSender = async (
    friendshipId: string,
    senderId: string,
    fields: string = "status",
) => {
    return FriendModel.findOne({
        _id: friendshipId,
        sender: senderId,
    })
        .select(fields)
        .lean();
};

/** Finds friend requests sent by a user with a given status.
 *
 * @param {string} userId - The sender's user ID.
 * @param {FriendDocument["status"]} status - The request status to match.
 * @returns {Promise<any[]>} A promise resolving to matching friend requests.
 */
const findSentFriendRequestsByStatus = async (userId: string, status: FriendDocument["status"]) => {
    return FriendModel.find({
        sender: userId,
        status,
    })
        .populate("receiver", "username name avatar")
        .lean();
};

/** Finds pending friend requests sent to a user.
 *
 * @param {string} userId - The receiver's user ID.
 * @returns {Promise<any[]>} A promise resolving to pending friend requests.
 */
const findPendingRequestsByReceiver = async (userId: string) => {
    return FriendModel.find({
        receiver: userId,
        status: "pending",
    })
        .populate("sender", "username name avatar")
        .select("sender createdAt")
        .lean();
};

/** Deletes an accepted friendship owned by the given user.
 *
 * @param {string} userId - The ID of one user in the friendship.
 * @param {string} friendshipId - The friendship ID.
 * @returns {Promise<any>} A promise resolving to the delete result.
 */
const deleteFriendship = async (userId: string, friendshipId: string) => {
    return FriendModel.deleteOne({
        _id: friendshipId,
        $or: [{ sender: userId }, { receiver: userId }],
        status: "accepted",
    });
};

/** Rejects a friend request and stores when the rejection expires.
 *
 * @param {string} friendshipId - The friendship ID.
 * @param {Date} rejectedAt - The time the request was rejected.
 * @param {Date} rejectionExpiresAt - The time the rejection expires.
 * @returns {Promise<any>} A promise resolving to the update result.
 */
const rejectFriendRequest = async (
    friendshipId: string,
    rejectedAt: Date,
    rejectionExpiresAt: Date,
) => {
    return FriendModel.updateOne(
        {
            _id: friendshipId,
        },
        {
            $set: {
                status: "rejected",
                rejectedAt,
                rejectionExpiresAt,
            },
        },
    );
};

/** Finds accepted friendships for a list of online users.
 *
 * @param {string[]} onlineFriendIds - IDs of the users to check.
 * @param {string} [fields="sender receiver -_id"] - Fields to return.
 * @returns {Promise<any[]>} A promise resolving to matching friendships.
 */
const findAcceptedFriendshipsByUserIds = async (
    onlineFriendIds: string[],
    fields: string = "sender receiver -_id",
) => {
    return FriendModel.find({
        $or: [
            {
                sender: {
                    $in: onlineFriendIds,
                },
            },
            {
                receiver: {
                    $in: onlineFriendIds,
                },
            },
        ],
        status: "accepted",
    })
        .select(fields)
        .lean();
};

/** Checks whether two users have a friendship with a given status.
 *
 * @param {string} senderId - The ID of the first user.
 * @param {string} receiverId - The ID of the second user.
 * @param {FriendDocument["status"]} status - The status to match.
 * @returns {Promise<boolean>} A promise resolving to whether it exists.
 */
const existsFriendship = async (
    senderId: string,
    receiverId: string,
    status: FriendDocument["status"],
) => {
    return FriendModel.exists({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
        ],
        status,
    }).lean();
};

export default {
    create,
    findRelationshipBetweenUsers,
    deleteFriendshipByIdAndStatus,
    deleteFriendshipById,
    findFriendshipsByStatus,
    updateStatusById,
    findFriendshipById,
    findFriendshipByIdAndReceiver,
    findFriendshipByIdAndSender,
    findSentFriendRequestsByStatus,
    findPendingRequestsByReceiver,
    deleteFriendship,
    rejectFriendRequest,
    findAcceptedFriendshipsByUserIds,
    existsFriendship,
};
