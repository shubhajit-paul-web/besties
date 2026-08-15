import type { OpenAPIV3 } from "openapi-types";

const AuthApiDoc: OpenAPIV3.PathsObject = {
    "/auth/register/initiate": {
        post: {
            summary: "Initiate registration and send OTP to user's email",
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
                    description: "Accepted",
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
                    description: "Bad request",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ValidationErrorResponse",
                            },
                        },
                    },
                },

                409: {
                    description: "Conflict",
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

    "/auth/register/verify": {
        post: {
            summary: "Verify registration OTP and create user account",
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
                    description: "Created",
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
                    description: "Bad request",
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
                    description: "Conflict",
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
};

export default AuthApiDoc;
