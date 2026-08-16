import type { OpenAPIV3 } from "openapi-types";
import { type SwaggerUiOptions, type SwaggerOptions } from "swagger-ui-express";
import config from "./environment.js";
import AuthApiDoc from "../swagger/auth.swagger.js";
import FriendApiDoc from "../swagger/friend.swagger.js";

const swaggerDocument: OpenAPIV3.Document = {
    openapi: "3.0.0",

    info: {
        title: "Besties official APIs",
        description: "All the private and public APIs are listed here",
        version: "1.0.0",
        contact: {
            name: "Shubhajit Paul",
            email: "shubhajitbusinessid@gmail.com",
        },
    },

    servers: [{ url: config.SERVER_URL! }],

    security: [{ bearerAuth: [] }],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description:
                    "Use the access token returned by login or provided in cookies. The server also accepts the token from the accessToken cookie.",
            },
        },

        headers: {
            AuthCookies: {
                description:
                    "Sets HTTP-only cookies containing the access token and refresh token.",
                schema: {
                    type: "string",
                    example:
                        "accessToken=<JWT>; HttpOnly; Secure; SameSite=Strict; Path=/, refreshToken=<Crypto>; HttpOnly; Secure; SameSite=Strict; Path=/",
                },
            },
        },

        schemas: {
            ValidationErrorResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: false,
                    },
                    statusCode: {
                        type: "integer",
                        example: 400,
                    },
                    isOperational: {
                        type: "boolean",
                        example: true,
                    },
                    message: {
                        type: "string",
                        example: "Validation faild.",
                    },
                    data: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                source: {
                                    type: "string",
                                    example: "body",
                                },
                                field: {
                                    type: "string",
                                    example: "username",
                                },
                                message: {
                                    type: "string",
                                    example: "Username is required",
                                },
                            },
                        },
                    },
                },
            },

            SuccessResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true,
                    },
                    statusCode: {
                        type: "integer",
                        example: 200,
                    },
                    message: {
                        type: "string",
                    },
                    data: {
                        type: "object",
                        nullable: true,
                        description: "Optional payload returned for successful operations.",
                    },
                },
            },

            FailureResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: false,
                    },
                    statusCode: {
                        type: "integer",
                        example: 400,
                    },
                    isOperational: {
                        type: "boolean",
                        example: true,
                    },
                    message: {
                        type: "string",
                    },
                },
            },

            InternalServerErrorResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: false,
                    },
                    statusCode: {
                        type: "integer",
                        example: 500,
                    },
                    isOperational: {
                        type: "boolean",
                        example: false,
                    },
                    message: {
                        type: "string",
                        example: "Internal server error.",
                    },
                },
            },

            PublicUser: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                        example: "64d2c4d6a0f2ec59bc74f912",
                    },
                    username: {
                        type: "string",
                        example: "sameer_12",
                    },
                    name: {
                        type: "object",
                        properties: {
                            first: {
                                type: "string",
                                example: "sameer",
                            },
                            last: {
                                type: "string",
                                nullable: true,
                                example: "khan",
                            },
                        },
                    },
                    avatar: {
                        type: "string",
                        nullable: true,
                        example: "https://cdn.example.com/avatar.png",
                    },
                },
            },

            Friendship: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                        example: "64d2c4d6a0f2ec59bc74f912",
                    },
                    sender: {
                        type: "string",
                        example: "64d1f5c3d7b4b95a55581fe2",
                    },
                    receiver: {
                        type: "string",
                        example: "64d2c4d6a0f2ec59bc74f912",
                    },
                    status: {
                        type: "string",
                        enum: ["pending", "accepted", "rejected"],
                        example: "pending",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-08-16T10:00:00.000Z",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-08-16T10:00:00.000Z",
                    },
                    rejectedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: "2026-08-17T10:00:00.000Z",
                    },
                    rejectionExpiresAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: "2026-08-24T10:00:00.000Z",
                    },
                },
            },

            FriendshipWithReceiver: {
                allOf: [
                    { $ref: "#/components/schemas/Friendship" },
                    {
                        type: "object",
                        properties: {
                            receiver: {
                                $ref: "#/components/schemas/PublicUser",
                            },
                        },
                    },
                ],
            },

            FriendshipWithSender: {
                allOf: [
                    { $ref: "#/components/schemas/Friendship" },
                    {
                        type: "object",
                        properties: {
                            sender: {
                                $ref: "#/components/schemas/PublicUser",
                            },
                        },
                    },
                ],
            },
        },
    },

    paths: {
        ...AuthApiDoc,
        ...FriendApiDoc,
    },
};

const swaggerUiOptions: SwaggerUiOptions = {
    explorer: true,
    customSiteTitle: "Besties official API docs",
    swaggerOptions: {
        // docExpansion: "list",
        filter: true,
        persistAuthorization: true,
        displayRequestDuration: true,
    } satisfies SwaggerOptions,
};

export default { swaggerDocument, swaggerUiOptions };
