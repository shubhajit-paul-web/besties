/**
 * Standard API response wrapper for success responses.
 * @class
 */
class ApiResponse {
    /**
     * Creates a standardized success response.
     * @param statusCode - HTTP status code.
     * @param message - Human-readable response message.
     * @param data - Optional response payload.
     * @param meta - Optional response metadata.
     */

    public success: boolean;

    constructor(
        public statusCode: number = 200,
        public message: string,
        public data?: object,
        public meta?: object,
    ) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;

        if (meta) this.meta = meta;
    }

    /**
     * Builds a success response.
     * @param message - Human-readable response message.
     * @param data - Optional response payload.
     * @param meta - Optional response metadata.
     * @param statusCode - HTTP status code.
     * @returns ApiResponse instance.
     */
    static success(message: string, data?: object, meta?: object, statusCode: number = 200) {
        return new ApiResponse(statusCode, message, data, meta);
    }

    /**
     * Builds a 201 Created response.
     * @param message - Human-readable response message.
     * @param data - Optional response payload.
     * @param meta - Optional response metadata.
     * @returns ApiResponse instance.
     */
    static created(message: string, data?: object, meta?: object) {
        return new ApiResponse(201, message, data, meta);
    }
}

export default ApiResponse;
