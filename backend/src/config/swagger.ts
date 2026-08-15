import type { OpenAPIV3 } from "openapi-types";
import { type SwaggerUiOptions, type SwaggerOptions } from "swagger-ui-express";
import config from "./environment.js";
import AuthApiDoc from "../swagger/auth.swagger.js";

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

    components: {
        schemas: {
            ValidationErrorResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: false,
                    },
                    statusCode: {
                        type: "number",
                        example: 400,
                    },
                    message: {
                        type: "string",
                        example: "Validation faild",
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
        },
    },

    paths: {
        ...AuthApiDoc,
    },
};

const swaggerUiOptions: SwaggerUiOptions = {
    explorer: true,
    customSiteTitle: "Besties official API docs",
    swaggerOptions: {
        docExpansion: "none",
        filter: true,
        persistAuthorization: true,
        displayRequestDuration: true,
    } satisfies SwaggerOptions,
};

export default { swaggerDocument, swaggerUiOptions };
