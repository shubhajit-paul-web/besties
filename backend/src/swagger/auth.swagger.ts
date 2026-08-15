import type { OpenAPIV3 } from "openapi-types";

const AuthApiDoc: OpenAPIV3.PathsObject = {
    "/auth/register": {
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
                400: {
                    description: "Validation faild",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ValidationErrorResponse",
                            },
                        },
                    },
                },

                409: {
                    description: "An OTP has already been sent",
                },
            },
        },
    },
};

export default AuthApiDoc;
