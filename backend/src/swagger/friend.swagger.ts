import type { OpenAPIV3 } from "openapi-types";

const FriendApiDoc: OpenAPIV3.PathsObject = {
    "/friends/requests": {
        post: {
            summary: "Send a friend request to another user",
            tags: ["Friends"],
            description:
                "Creates a friendship record with status pending when the authenticated user sends a request to a different user.",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["receiverId"],
                            properties: {
                                receiverId: {
                                    type: "string",
                                    pattern: "^[a-fA-F0-9]{24}$",
                                    example: "64d1f5c3d7b4b95a55581fe2",
                                    description:
                                        "MongoDB ObjectId of the user who should receive the request.",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Friend request created successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 201,
                                message: "Friend request sent successfully.",
                                data: {
                                    _id: "64d1f5c3d7b4b95a55581fe2",
                                    sender: "64d1f5c3d7b4b95a55581fe2",
                                    receiver: "64d2c4d6a0f2ec59bc74f912",
                                    status: "pending",
                                    createdAt: "2026-08-16T10:00:00.000Z",
                                    updatedAt: "2026-08-16T10:00:00.000Z",
                                },
                            },
                        },
                    },
                },
                400: {
                    description:
                        "The request is invalid, including trying to send a request to yourself.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                409: {
                    description:
                        "A pending request already exists, both users are already connected, or a rejected request is still in its cool-down window.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                500: {
                    description: "Unexpected server error while creating the friendship.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/InternalServerErrorResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/friends/suggestions": {
        get: {
            summary: "Get friend suggestions for the authenticated user",
            tags: ["Friends"],
            description:
                "Returns a small randomized set of users who are not already connected to the current user and are not the current user themselves.",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Suggestions fetched successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Friend suggestions fetched successfully.",
                                data: {
                                    suggestions: [
                                        {
                                            _id: "64d2c4d6a0f2ec59bc74f912",
                                            username: "sameer_12",
                                            name: {
                                                first: "sameer",
                                                last: "khan",
                                            },
                                            avatar: "https://cdn.example.com/avatar.png",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/friends": {
        get: {
            summary: "List friends by friendship status",
            tags: ["Friends"],
            description:
                "Returns the profiles of users connected to the authenticated user for the selected friendship status. Defaults to accepted if no status is provided.",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "query",
                    name: "status",
                    required: false,
                    schema: {
                        type: "string",
                        enum: ["pending", "accepted", "rejected"],
                    },
                    description: "Optional friendship status. If omitted, it defaults to accepted.",
                    example: "accepted",
                },
            ],
            responses: {
                200: {
                    description: "List of connected users returned successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Accepted friends retrieved successfully.",
                                data: {
                                    friends: [
                                        {
                                            _id: "64d2c4d6a0f2ec59bc74f912",
                                            username: "sameer_12",
                                            name: {
                                                first: "sameer",
                                                last: "khan",
                                            },
                                            avatar: "https://cdn.example.com/avatar.png",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                400: {
                    description: "Invalid status query value.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ValidationErrorResponse",
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/friends/requests/:friendshipId/accept": {
        patch: {
            summary: "Accept a pending friend request",
            tags: ["Friends"],
            description:
                "Accepts the pending request for the authenticated user as the receiver. Returns no payload data on success.",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "friendshipId",
                    required: true,
                    schema: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                    },
                    description: "The friendship document ID to accept.",
                    example: "64d2c4d6a0f2ec59bc74f912",
                },
            ],
            responses: {
                200: {
                    description: "Friend request accepted successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Friend request accepted successfully.",
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                404: {
                    description:
                        "No pending request exists for the authenticated user and this friendship ID.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                409: {
                    description:
                        "The request is already accepted or rejected and cannot be accepted again.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/friends/requests/:friendshipId/reject": {
        patch: {
            summary: "Reject a pending friend request",
            tags: ["Friends"],
            description:
                "Rejects a pending request received by the authenticated user. The request is marked as rejected and cannot be resent until the rejection cool-down expires.",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "friendshipId",
                    required: true,
                    schema: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                    },
                    description: "The friendship document ID to reject.",
                    example: "64d2c4d6a0f2ec59bc74f912",
                },
            ],
            responses: {
                200: {
                    description: "Friend request rejected successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Friend request rejected successfully.",
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                404: {
                    description:
                        "No pending request exists for the authenticated user and this friendship ID.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                409: {
                    description: "The request is no longer pending and cannot be rejected.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/friends/requests/:friendshipId/cancel": {
        patch: {
            summary: "Cancel a sent friend request",
            tags: ["Friends"],
            description:
                "Cancels a pending friend request sent by the authenticated user. Only pending requests can be canceled.",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "friendshipId",
                    required: true,
                    schema: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                    },
                    description: "The friendship document ID to cancel.",
                    example: "64d2c4d6a0f2ec59bc74f912",
                },
            ],
            responses: {
                200: {
                    description: "Friend request canceled successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Friend request canceled successfully.",
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                404: {
                    description:
                        "No sent pending request exists for the authenticated user and this friendship ID.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                409: {
                    description: "The request is no longer pending and cannot be canceled.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/friends/requests/sent": {
        get: {
            summary: "List sent friend requests by status",
            tags: ["Friends"],
            description:
                "Returns the requests sent by the authenticated user. Defaults to pending if no status query is supplied.",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "query",
                    name: "status",
                    required: false,
                    schema: {
                        type: "string",
                        enum: ["pending", "accepted", "rejected"],
                    },
                    description: "The status to filter the sent friendship records by.",
                    example: "pending",
                },
            ],
            responses: {
                200: {
                    description: "Sent requests retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Pending friends retrieved successfully.",
                                data: {
                                    friendships: [
                                        {
                                            _id: "64d2c4d6a0f2ec59bc74f912",
                                            sender: "64d1f5c3d7b4b95a55581fe2",
                                            receiver: {
                                                _id: "64d2c4d6a0f2ec59bc74f912",
                                                username: "sameer_12",
                                                name: {
                                                    first: "sameer",
                                                    last: "khan",
                                                },
                                                avatar: "https://cdn.example.com/avatar.png",
                                            },
                                            status: "pending",
                                            createdAt: "2026-08-16T10:00:00.000Z",
                                            updatedAt: "2026-08-16T10:00:00.000Z",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                400: {
                    description: "Invalid status query value.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ValidationErrorResponse",
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/friends/requests/received": {
        get: {
            summary: "List pending friend requests received by the authenticated user",
            tags: ["Friends"],
            description:
                "Returns pending inbound friend requests for the current user, with the sender profile populated.",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Received requests fetched successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Friend requests retrieved successfully.",
                                data: {
                                    requests: [
                                        {
                                            _id: "64d2c4d6a0f2ec59bc74f912",
                                            sender: {
                                                _id: "64d1f5c3d7b4b95a55581fe2",
                                                username: "shubhajit_123",
                                                name: {
                                                    first: "shubhajit",
                                                    last: "paul",
                                                },
                                                avatar: "https://cdn.example.com/avatar.png",
                                            },
                                            createdAt: "2026-08-16T10:00:00.000Z",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/friends/:friendshipId": {
        delete: {
            summary: "Remove an accepted friendship",
            tags: ["Friends"],
            description:
                "Deletes an accepted friendship record for the authenticated user. This endpoint does not work for pending or rejected requests.",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "friendshipId",
                    required: true,
                    schema: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                    },
                    description: "The accepted friendship document ID to remove.",
                    example: "64d2c4d6a0f2ec59bc74f912",
                },
            ],
            responses: {
                200: {
                    description: "Friend removed successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Friend removed successfully.",
                            },
                        },
                    },
                },
                401: {
                    description: "Missing or invalid access token.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
                404: {
                    description: "The friendship does not exist or is not accepted for this user.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                        },
                    },
                },
            },
        },
    },
};

export default FriendApiDoc;
