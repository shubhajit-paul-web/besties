/**
 * API error type for consistent HTTP error handling.
 *
 * Use this error for expected and unexpected failures across controllers,
 * services, and middleware. Server errors (5xx) are logged automatically.
 *
 * @extends Error
 * @property {boolean} success Always `false` for error responses.
 * @property {number} statusCode HTTP status code.
 * @property {string} message Human-readable error message.
 * @property {boolean} isOperational Indicates expected/handled errors.
 * @property {object|string|undefined} details Optional extra error context.
 * @property {string|undefined} stack Optional stack trace.
 */
class ApiError extends Error {
    public readonly success = false;

    constructor(
        public statusCode: number,
        public message: string,
        public isOperational: boolean = true,
        public options?: {
            details?: object | string;
            stack?: string;
            meta?: object;
        },
    ) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;

        if (options?.stack) this.stack = options.stack;
        else Error.captureStackTrace(this, this.constructor);

        // // Meta info of the error (log payload)
        // const logPayload = { statusCode, isOperational, details: options?.details };

        // // Log error when it's created
        // if (statusCode >= 500) {
        //     logger.error(`INTERNAL_SERVER_ERROR: ${message}`, {
        //         ...logPayload,
        //         stack: this.stack,
        //     });
        // }
    }
}

export default ApiError;
