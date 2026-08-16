import type { OpenAPIV3 } from "openapi-types";

const AuthApiDoc: OpenAPIV3.PathsObject = {
    "/auth/register/initiate": {
        post: {
            summary: "Start account registration by validating details and sending an email OTP",
            tags: ["Authentication"],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["username", "name", "gender", "dob", "email", "password"],
                            properties: {
                                username: {
                                    type: "string",
                                    minLength: 3,
                                    maxLength: 30,
                                    pattern: "^[a-zA-Z0-9_]+$",
                                    example: "shubhajit_123",
                                    description:
                                        "Unique username containing 3–30 characters. Only letters, numbers, and underscores are allowed. Leading and trailing whitespace is trimmed, and the username is converted to lowercase.",
                                },
                                name: {
                                    type: "object",
                                    required: ["first"],
                                    properties: {
                                        first: {
                                            type: "string",
                                            example: "Shubhajit",
                                        },
                                        last: {
                                            type: "string",
                                            example: "Paul",
                                        },
                                    },
                                },
                                gender: {
                                    type: "string",
                                    enum: ["male", "female", "custom"],
                                    example: "male",
                                },
                                dob: {
                                    type: "string",
                                    example: "2006-04-21",
                                    description: "DOB must be in YYYY-MM-DD format",
                                },
                                email: {
                                    type: "string",
                                    example: "shubhajit@example.com",
                                },
                                mobile: {
                                    type: "string",
                                    example: "0123456789",
                                    description:
                                        "Optional Indian mobile number. Accepts numbers with or without the +91, 91, or 0 country/STD prefix. Whitespace is ignored",
                                },
                                password: {
                                    type: "string",
                                    minLength: 8,
                                    pattern: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).*$",
                                    example: "Password@123",
                                    description:
                                        "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
                                },
                            },
                        },
                    },
                },
            },

            responses: {
                200: {
                    description:
                        "Registration data accepted and OTP sent to the provided email address",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "OTP sent successfully.",
                            },
                        },
                    },
                },

                400: {
                    description:
                        "Validation failed due to missing, malformed, or invalid registration fields",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ValidationErrorResponse",
                            },
                        },
                    },
                },

                409: {
                    description:
                        "Registration cannot proceed because the username/account already exists or an active OTP request is present",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                            examples: {
                                usernameTaken: {
                                    summary: "Username already exists",
                                    value: {
                                        success: false,
                                        statusCode: 409,
                                        isOperational: true,
                                        message: "Username is already taken.",
                                    },
                                },
                                accountExists: {
                                    summary: "Account already exists",
                                    value: {
                                        success: false,
                                        statusCode: 409,
                                        isOperational: true,
                                        message:
                                            "An account with the provided email or phone number already exists.",
                                    },
                                },
                                otpExists: {
                                    summary: "OTP already exists",
                                    value: {
                                        success: false,
                                        statusCode: 409,
                                        isOperational: true,
                                        message: "An OTP has already been sent.",
                                    },
                                },
                            },
                        },
                    },
                },

                500: {
                    description:
                        "Unexpected server error while initiating registration or sending OTP",
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

    "/auth/register/verify": {
        post: {
            summary: "Complete registration by verifying OTP and creating the user account",
            tags: ["Authentication"],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                username: {
                                    type: "string",
                                    minLength: 3,
                                    maxLength: 30,
                                    pattern: "^[a-zA-Z0-9_]+$",
                                    example: "shubhajit_123",
                                    description:
                                        "Unique username containing 3–30 characters. Only letters, numbers, and underscores are allowed. Leading and trailing whitespace is trimmed, and the username is converted to lowercase.",
                                },
                                name: {
                                    type: "object",
                                    required: ["first"],
                                    properties: {
                                        first: {
                                            type: "string",
                                            example: "Shubhajit",
                                        },
                                        last: {
                                            type: "string",
                                            example: "Paul",
                                        },
                                    },
                                },
                                gender: {
                                    type: "string",
                                    enum: ["male", "female", "custom"],
                                    example: "male",
                                },
                                dob: {
                                    type: "string",
                                    example: "2006-04-21",
                                    description: "DOB must be in YYYY-MM-DD format",
                                },
                                email: {
                                    type: "string",
                                    example: "shubhajit@example.com",
                                },
                                mobile: {
                                    type: "string",
                                    example: "0123456789",
                                    description:
                                        "Optional Indian mobile number. Accepts numbers with or without the +91, 91, or 0 country/STD prefix. Whitespace is ignored",
                                },
                                password: {
                                    type: "string",
                                    minLength: 8,
                                    example: "Password@123",
                                    description:
                                        "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
                                },
                                otp: {
                                    type: "string",
                                    minLength: 6,
                                    maxLength: 6,
                                    example: "456789",
                                    description: "OTP must be 6 digits",
                                },
                            },
                        },
                    },
                },
            },

            responses: {
                201: {
                    description:
                        "OTP verified successfully, account created, and authentication cookies set",
                    headers: {
                        "Set-Cookie": {
                            $ref: "#/components/headers/AuthCookies",
                        },
                    },
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 201,
                                message: "Account created successfully.",
                            },
                        },
                    },
                },

                400: {
                    description:
                        "Request validation failed or OTP is invalid/expired for the provided registration payload",
                    content: {
                        "application/json": {
                            schema: {
                                oneOf: [
                                    {
                                        $ref: "#/components/schemas/ValidationErrorResponse",
                                    },
                                    {
                                        $ref: "#/components/schemas/FailureResponse",
                                    },
                                ],
                            },
                            examples: {
                                validationError: {
                                    summary: "Validation error",
                                    value: {
                                        success: false,
                                        statusCode: 400,
                                        isOperational: true,
                                        message: "Validation failed.",
                                        errors: [
                                            {
                                                source: "body",
                                                field: "username",
                                                message: "Username is required",
                                            },
                                        ],
                                    },
                                },

                                otpExpired: {
                                    summary: "OTP expired",
                                    value: {
                                        success: false,
                                        statusCode: 400,
                                        isOperational: false,
                                        message: "The OTP has expired. Please request a new one.",
                                    },
                                },
                            },
                        },
                    },
                },

                409: {
                    description:
                        "Account creation failed because the username or account identity already exists",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                            examples: {
                                usernameTaken: {
                                    summary: "Username already exists",
                                    value: {
                                        success: false,
                                        statusCode: 409,
                                        isOperational: true,
                                        message: "Username is already taken.",
                                    },
                                },
                                accountExists: {
                                    summary: "Account already exists",
                                    value: {
                                        success: false,
                                        statusCode: 409,
                                        isOperational: true,
                                        message:
                                            "An account with the provided email or phone number already exists.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    "/auth/login": {
        post: {
            summary: "Authenticate user and issue authentication tokens",
            tags: ["Authentication"],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["identifier", "password"],
                            properties: {
                                identifier: {
                                    type: "string",
                                    example: "shubhajit_123",
                                    description:
                                        "Username or email address associated with the account",
                                },
                                password: {
                                    type: "string",
                                    example: "Password@123",
                                    description: "User's account password",
                                },
                            },
                        },
                        examples: {
                            withUsername: {
                                summary: "Login with username",
                                value: {
                                    identifier: "shubhajit_123",
                                    password: "Password@123",
                                },
                            },
                            withEmail: {
                                summary: "Login with email",
                                value: {
                                    identifier: "shubhajit@example.com",
                                    password: "Password@123",
                                },
                            },
                        },
                    },
                },
            },

            responses: {
                200: {
                    description: "Login successful",
                    headers: {
                        "Set-Cookie": {
                            $ref: "#/components/headers/AuthCookies",
                        },
                    },
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Login successfully.",
                                data: {
                                    user: {
                                        _id: "60b5c3c3c3c3c3c3c3c3c3c3",
                                        username: "shubhajit_123",
                                        email: "shubhajit@example.com",
                                        name: {
                                            first: "shubhajit",
                                            last: "paul",
                                        },
                                        gender: "male",
                                        dob: "2006-04-21T00:00:00.000Z",
                                        avatar: "https://example.com/avatar.jpg",
                                        bio: "My bio",
                                        mobileNumber: "0123456789",
                                        createdAt: "2026-08-16T00:00:00.000Z",
                                        updatedAt: "2026-08-16T00:00:00.000Z",
                                    },
                                },
                            },
                        },
                    },
                },

                400: {
                    description: "Bad request or validation error",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ValidationErrorResponse",
                            },
                            example: {
                                success: false,
                                statusCode: 400,
                                isOperational: true,
                                message: "Validation failed.",
                                errors: [
                                    {
                                        source: "body",
                                        field: "identifier",
                                        message: "Username or email is required",
                                    },
                                ],
                            },
                        },
                    },
                },

                401: {
                    description: "Unauthorized - Invalid credentials",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                            example: {
                                success: false,
                                statusCode: 401,
                                isOperational: true,
                                message: "Incorrect email, username, or password",
                            },
                        },
                    },
                },

                500: {
                    description: "Internal server error",
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

    "/auth/logout": {
        post: {
            summary: "Logout user and clear authentication tokens",
            tags: ["Authentication"],

            responses: {
                200: {
                    description: "Logout successful",
                    headers: {
                        "Set-Cookie": {
                            description:
                                "Clears authentication cookies (accessToken, refreshToken) with httpOnly=true, secure=true (in prod), sameSite=strict",
                            schema: {
                                type: "string",
                            },
                        },
                    },
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Logout successful.",
                            },
                        },
                    },
                },

                500: {
                    description: "Internal server error",
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

    "/auth/refresh": {
        post: {
            summary: "Refresh access and refresh tokens using valid refresh token",
            tags: ["Authentication"],
            description:
                "Requires a valid refresh token in cookies. Validates the token and issues new access and refresh tokens.",

            responses: {
                200: {
                    description: "Tokens refreshed successfully",
                    headers: {
                        "Set-Cookie": {
                            $ref: "#/components/headers/AuthCookies",
                        },
                    },
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse",
                            },
                            example: {
                                success: true,
                                statusCode: 200,
                                message: "Tokens refreshed successfully.",
                            },
                        },
                    },
                },

                400: {
                    description: "Bad request - Invalid or expired refresh token",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                            examples: {
                                tokenExpired: {
                                    summary: "Refresh token expired",
                                    value: {
                                        success: false,
                                        statusCode: 400,
                                        isOperational: true,
                                        message: "Refresh token has expired",
                                    },
                                },
                                tokenInvalid: {
                                    summary: "Refresh token invalid",
                                    value: {
                                        success: false,
                                        statusCode: 400,
                                        isOperational: true,
                                        message: "Invalid refresh token",
                                    },
                                },
                            },
                        },
                    },
                },

                401: {
                    description:
                        "Unauthorized - No refresh token provided or token validation failed",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FailureResponse",
                            },
                            example: {
                                success: false,
                                statusCode: 401,
                                isOperational: true,
                                message: "Refresh token not found or invalid",
                            },
                        },
                    },
                },

                500: {
                    description: "Internal server error",
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
};

export default AuthApiDoc;
